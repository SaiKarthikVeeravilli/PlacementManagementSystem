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

    console.log("==========================================");
    console.log("LOCAL AI RESUME PROCESSING STARTED");
    console.log("==========================================");


    // ==========================================
    // GET STUDENT PROFILE
    // ==========================================

    console.log("STEP 1: Finding student profile...");

    const profile = await StudentModel.findOne({
      userID: req.user._id,
    });

    if (!profile) {
      console.log("ERROR: Student profile not found");

      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    console.log("STEP 1 SUCCESS: Student profile found");


    // ==========================================
    // CHECK RESUME
    // ==========================================

    console.log("STEP 2: Checking resume...");

    if (!profile.resume || !profile.resume.filepath) {

      console.log("ERROR: Resume not found");

      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    console.log("STEP 2 SUCCESS: Resume found");
    console.log("Resume URL:", profile.resume.filepath);


    // ==========================================
    // GET RESUME FROM CLOUDINARY
    // ==========================================

    console.log("STEP 3: Downloading resume from Cloudinary...");

    const fileUrl = profile.resume.filepath;

    const response = await fetch(fileUrl);

    console.log(
      "Cloudinary response status:",
      response.status
    );

    if (!response.ok) {

      console.log(
        "ERROR: Unable to download resume from Cloudinary"
      );

      return res.status(404).json({
        success: false,
        message: "Unable to access resume from Cloudinary",
      });
    }

    const arrayBuffer = await response.arrayBuffer();

    const pdfBuffer = Buffer.from(arrayBuffer);

    console.log(
      "STEP 3 SUCCESS: Resume downloaded",
      "Size:",
      pdfBuffer.length,
      "bytes"
    );


    // ==========================================
    // READ PDF
    // ==========================================

    console.log("STEP 4: Extracting PDF text...");

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();

    const extractedText = pdfData.text;

    await parser.destroy();

    console.log(
      "STEP 4 SUCCESS: PDF text extracted",
      "Characters:",
      extractedText?.length || 0
    );


    // ==========================================
    // CLEAN TEXT
    // ==========================================

    console.log("STEP 5: Cleaning extracted text...");

    const cleanedText = cleanText(extractedText);

    if (!cleanedText) {

      console.log(
        "ERROR: No text could be extracted from resume"
      );

      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    console.log(
      "STEP 5 SUCCESS: Text cleaned",
      "Characters:",
      cleanedText.length
    );


    // ==========================================
    // SPLIT INTO CHUNKS
    // ==========================================

    console.log("STEP 6: Splitting resume into chunks...");

    const chunks = splitIntoChunks(cleanedText);

    console.log(
      "STEP 6 SUCCESS: Total chunks:",
      chunks.length
    );


    const embeddedChunks = [];


    // ==========================================
    // GENERATE LOCAL EMBEDDINGS
    // ==========================================

    console.log(
      "STEP 7: Generating Ollama embeddings..."
    );

    for (let i = 0; i < chunks.length; i++) {

      const chunk = chunks[i];

      console.log(
        `Generating embedding ${i + 1}/${chunks.length}...`
      );

      const embedding =
        await generateLocalEmbedding(chunk);

      console.log(
        `Embedding ${i + 1} generated successfully`
      );

      embeddedChunks.push({

        studentId: profile._id,

        // Stable resume ID
        resumeId: profile._id,

        chunkIndex: i,

        text: chunk,

        embedding: embedding,
      });
    }

    console.log(
      "STEP 7 SUCCESS: All embeddings generated"
    );


    // ==========================================
    // REMOVE OLD CHUNKS
    // ==========================================

    console.log(
      "STEP 8: Removing old resume chunks..."
    );

    await ResumeChunkModel.deleteMany({
      studentId: profile._id,
    });

    console.log(
      "STEP 8 SUCCESS: Old chunks removed"
    );


    // ==========================================
    // SAVE NEW CHUNKS
    // ==========================================

    console.log(
      "STEP 9: Saving new resume chunks..."
    );

    await ResumeChunkModel.insertMany(
      embeddedChunks
    );

    console.log(
      "STEP 9 SUCCESS: Resume chunks saved"
    );


    // ==========================================
    // SUCCESS
    // ==========================================

    console.log("==========================================");
    console.log("LOCAL AI RESUME PROCESSING COMPLETED");
    console.log("==========================================");

    return res.status(200).json({

      success: true,

      message:
        "Resume processed using local embeddings successfully",

      totalChunks:
        embeddedChunks.length,
    });


  } catch (err) {

    console.error("==========================================");
    console.error("LOCAL RESUME PROCESSING ERROR");
    console.error("==========================================");

    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

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

    if (!profile.resume || !profile.resume.filepath) {
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
    // MATCH RESUME WITH JOB USING LOCAL AI
    // ==========================================

    const result =
      await matchResumeWithJobLocal(
        jobDescription,

        // Student ID
        profile._id,

        // Resume ID
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

    console.error(
      "LOCAL JOB MATCHING ERROR:",
      err
    );

    next(err);
  }
};


module.exports = {
  analyzeResumeLocal,
  matchJobLocal,
};