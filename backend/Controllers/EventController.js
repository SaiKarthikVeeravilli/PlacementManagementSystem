const EventModel = require("../Models/EventModel");


// ==========================================
// ADMIN → CREATE EVENT
// ==========================================
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, type } = req.body;

    const eventDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    // Prevent creating past events
    if (eventDate < today) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past"
      });
    }

    const event = await EventModel.create({
      title,
      description,
      date: eventDate,
      type
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (err) {
    next(err);
  }
};


// ==========================================
// STUDENT → GET EVENTS
// ==========================================

const getEvents = async (req, res, next) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const events = await EventModel.find({
      date: { $gte: today }
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      events
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createEvent,
  getEvents
};