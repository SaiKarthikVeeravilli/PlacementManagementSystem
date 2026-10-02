const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const StudentModel = require("../Models/StudentModel");
const JobModel = require("../Models/JobModel");
const ResumeChunkModel = require("../Models/ResumeChunkModel");

const {
  matchResumeWithJob
} = require("../Utils/jobMatching");

const {
  cleanText,
  splitIntoChunks
} = require("../Utils/textUtils");

const {
  generateEmbedding
} = require("../Utils/embeddingUtils");


// ==================================================
// ANALYZE / PROCESS RESUME
// ==================================================

const analyzeResume = async (req, res, next) => {
  try {

    // 1. Find logged-in student's profile
    const profile = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }


    // 2. Check whether resume exists
    if (
      !profile.resume ||
      !profile.resume.filepath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }


    // 3. Get resume file path
    const filePath = profile.resume.filepath;


    // 4. Check whether file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file does not exist"
      });
    }


    // 5. Read PDF
    const pdfBuffer = fs.readFileSync(filePath);


    // 6. Extract text from PDF
    const parser = new PDFParse({
      data: pdfBuffer
    });

    const pdfData = await parser.getText();

    const extractedText = pdfData.text;

    await parser.destroy();


    // 7. Clean extracted text
    const cleanedText = cleanText(extractedText);


    // 8. Check whether text was extracted
    if (!cleanedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume"
      });
    }


    // 9. Split text into chunks
    const chunks = splitIntoChunks(cleanedText);


    // 10. Generate embeddings for every chunk
    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {

      const chunk = chunks[i];

      const embedding = await generateEmbedding(chunk);

      embeddedChunks.push({
        studentId: profile._id,
        resumeId: profile.resume._id,
        chunkIndex: i,
        text: chunk,
        embedding: embedding
      });
    }


    // 11. Delete old chunks for this resume
    await ResumeChunkModel.deleteMany({
      studentId: profile._id,
   
    });


    // 12. Store new chunks and embeddings
    await ResumeChunkModel.insertMany(
      embeddedChunks
    );


    // 13. Send response
    return res.status(200).json({
      success: true,
      message:
        "Resume processed and embeddings stored successfully",
      totalChunks: embeddedChunks.length
    });

  } catch (err) {
    next(err);
  }
};


// ==================================================
// MATCH RESUME WITH JOB
// ==================================================

const matchJob = async (req, res, next) => {
  try {

    // Get selected job ID
    const {
      jobId
    } = req.body;


    // 1. Check job ID
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }


    // 2. Find logged-in student's profile
    const profile = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }


    // 3. Check whether student has a resume
    if (
      !profile.resume ||
      !profile.resume._id
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }


    // 4. Find selected job
    const job = await JobModel.findById(
      jobId
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }


    // 5. Get job description from database
    const jobDescription =
      job.description;


    // 6. Match resume with job
    const result =
      await matchResumeWithJob(
        jobDescription,
        profile._id,
        profile.resume._id
      );


    // 7. Send result
    return res.status(200).json({
      success: true,
      message:
        "Resume matched with job successfully",
      analysis: result.analysis,
      relevantChunks:
        result.relevantChunks
    });

  } catch (err) {
    next(err);
  }
};


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  analyzeResume,
  matchJob
};