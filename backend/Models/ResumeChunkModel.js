const mongoose = require("mongoose");

const resumeChunkSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    chunkIndex: {
      type: Number,
      required: true
    },

    text: {
      type: String,
      required: true
    },

    embedding: {
      type: [Number],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ResumeChunk",
  resumeChunkSchema
);