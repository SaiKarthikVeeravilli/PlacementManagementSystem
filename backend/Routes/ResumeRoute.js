const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../Middlewares/AuthMidlleware");
const ResumeController = require("../Controllers/ResumeController");

router.post(
  "/student/resume/analyze",
  AuthMiddleware,
  ResumeController.analyzeResume
);
router.post(
  "/student/resume/match-job",
  AuthMiddleware,
  ResumeController.matchJob
);

module.exports = router;