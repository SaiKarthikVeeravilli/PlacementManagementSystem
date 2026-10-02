const fs = require("fs");

const { PDFParse } = require("pdf-parse");

const StudentModel = require("../Models/StudentModel");
const JobModel = require("../Models/JobModel");
const ResumeChunkModel = require("../Models/ResumeChunkModel");

const {
  matchResumeWithJobLocal,
} = require("../Utils/localJobMatching");

const {
  cleanText,
  splitIntoChunks,
} = require("../Utils/textUtils");

const {
  generateLocalEmbedding,
} = require("../Utils/localEmbeddingUtils");


// ==========================================
// PROCESS RESUME
// ==========================================

const analyzeResumeLocal = async (req, res, next) => {
  try {
    const profile = await StudentModel.findOne({
      userID: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    if (
      !profile.resume ||
      !profile.resume.filepath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const filePath = profile.resume.filepath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file does not exist",
      });
    }

    // ==========================================
    // READ PDF
    // ==========================================

    const pdfBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();

    const extractedText = pdfData.text;

    await parser.destroy();

    // ==========================================
    // CLEAN TEXT
    // ==========================================

    const cleanedText = cleanText(extractedText);

    if (!cleanedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    // ==========================================
    // SPLIT INTO CHUNKS
    // ==========================================

    const chunks = splitIntoChunks(cleanedText);


    const embeddedChunks = [];

    // ==========================================
    // GENERATE LOCAL EMBEDDINGS
    // ==========================================

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

  

      const embedding =
        await generateLocalEmbedding(chunk);

      

      embeddedChunks.push({
        studentId: profile._id,

        // IMPORTANT:
        // Student ID is now used as the stable resume ID
        resumeId: profile._id,

        chunkIndex: i,

        text: chunk,

        embedding: embedding,
      });
    }

    // ==========================================
    // REMOVE OLD CHUNKS
    // ==========================================

    await ResumeChunkModel.deleteMany({
      studentId: profile._id,
    });

    // ==========================================
    // SAVE NEW CHUNKS
    // ==========================================

    await ResumeChunkModel.insertMany(
      embeddedChunks
    );

    return res.status(200).json({
      success: true,

      message:
        "Resume processed using local embeddings successfully",

      totalChunks:
        embeddedChunks.length,
    });

  } catch (err) {
    next(err);
  }
};


// ==========================================
// MATCH RESUME WITH JOB
// ==========================================

const matchJobLocal = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // ==========================================
    // GET STUDENT PROFILE
    // ==========================================

    const profile = await StudentModel.findOne({
      userID: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ==========================================
    // CHECK RESUME
    // ==========================================

    if (
      !profile.resume ||
      !profile.resume.filepath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // ==========================================
    // GET JOB
    // ==========================================

    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobDescription = job.description;

    // ==========================================
    // MATCH RESUME WITH JOB
    // ==========================================

    const result =
      await matchResumeWithJobLocal(
        jobDescription,

        // Stable student ID
        profile._id,

        // Stable resume ID
        profile._id
      );

    return res.status(200).json({
      success: true,

      message:
        "Resume matched with job using local AI successfully",

      analysis:
        result.analysis,

      relevantChunks:
        result.relevantChunks,
    });

  } catch (err) {
    next(err);
  }
};


module.exports = {
  analyzeResumeLocal,
  matchJobLocal,
};