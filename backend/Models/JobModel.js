const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    jobtitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: Number,
      required: true,
      min: 0,
    },

    eligibleBranches: {
      type: [String],
      required: true,
    },

    minimumCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    maximumBacklogs: {
      type: Number,
      required: true,
      min: 0,
    },

    skills: {
      type: [String],
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("job", JobSchema);

module.exports = JobModel;