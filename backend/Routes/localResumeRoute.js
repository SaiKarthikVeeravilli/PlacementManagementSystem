const express = require("express");

const router =
  express.Router();


const AuthMiddleware =
  require("../Middlewares/AuthMidlleware");


const LocalResumeController =
  require("../Controllers/localResumeController");


router.post(
  "/student/resume/local-analyze",

  AuthMiddleware,

  LocalResumeController.analyzeResumeLocal
);


router.post(
  "/student/resume/local-match-job",

  AuthMiddleware,

  LocalResumeController.matchJobLocal
);


module.exports = router;