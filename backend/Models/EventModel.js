const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    type: {
      type: String,
      enum: [
        "Interview",
        "Test",
        "Placement Drive",
        "Deadline",
        "Other"
      ],
      default: "Other"
    }
  },
  {
    timestamps: true
  }
);

const EventModel = mongoose.model(
  "event",
  EventSchema
);

module.exports = EventModel;