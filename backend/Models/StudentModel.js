const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    phoneno: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"],
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Others"],
    },

    collegename: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "CSE",
        "CSE(AI)",
        "CSE(DS)",
        "ECE",
        "EEE",
        "IT",
        "MECH",
        "CIVIL",
        "CHEMICAL",
      ],
    },

    currentyear: {
      type: String,
      required: true,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },

    currentsemester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    percentage10th: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    percentage12th: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    activebacklogs: {
      type: Number,
      required: true,
      min: 0,
    },

    passingyear: {
      type: Number,
      required: true,
      min: 2020,
      max: 2035,
    },

    skills: {
      type: [String],
      required: true,
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    resume: {
      filename: {
        type: String,
        default: "",
      },

      filepath: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("studentform", studentSchema);

module.exports = StudentModel;