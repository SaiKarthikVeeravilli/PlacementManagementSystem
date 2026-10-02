
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "application",
        "job",
        "system"
      ],
      default: "system"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = NotificationModel;

