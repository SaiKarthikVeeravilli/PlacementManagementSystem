const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentform",
      required: true,
    },

    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.model(
  "application",
  ApplicationSchema
);

module.exports = ApplicationModel;