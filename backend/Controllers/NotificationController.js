
const NotificationModel = require("../Models/NotificationModel");


// ==========================================
// GET NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res, next) => {

  try {
    const expiryDate = new Date(
  Date.now() - 30 * 24 * 60 * 60 * 1000
);

await NotificationModel.deleteMany({
  userID: req.user._id,
  type: { $ne: "application" },
  createdAt: { $lt: expiryDate }
});

    const notifications = await NotificationModel
      .find({
        userID: req.user._id
      })
      .sort({
        createdAt: -1
      });

    res.status(200).json({

      success: true,

      notifications

    });

  } catch (err) {

    next(err);

  }

};


// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================

const getUnreadCount = async (req, res, next) => {
  try {
    const expiryDate = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const count = await NotificationModel.countDocuments({
      userID: req.user._id,
      isRead: false,
      $or: [
        // Application notifications never expire
        {
          type: "application"
        },

        // Other notifications expire after 30 days
        {
          type: { $ne: "application" },
          createdAt: { $gte: expiryDate }
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res, next) => {

  try {

    const {
      id
    } = req.params;


    const notification =
      await NotificationModel.findOneAndUpdate(

        {
          _id: id,

          userID: req.user._id
        },

        {
          isRead: true
        },

        {
          new: true
        }

      );


    if (!notification) {

      return res.status(404).json({

        success: false,

        message: "Notification not found"

      });

    }


    res.status(200).json({

      success: true,

      message: "Notification marked as read"

    });

  } catch (err) {

    next(err);

  }

};
const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationModel.updateMany(
      {
        userID: req.user._id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {

  getNotifications,

  getUnreadCount,

  markAsRead,
  markAllAsRead

};

