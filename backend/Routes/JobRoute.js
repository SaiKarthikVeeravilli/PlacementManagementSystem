const express = require("express");
const router3 = express.Router();

const JobController = require("../Controllers/JobController");
const AdminMiddleware = require("../Middlewares/AdminMiddleware");

// Admin can add a job
router3.post("/addjob", AdminMiddleware, JobController.addJob);

// Everyone can view jobs
router3.get("/getjobs", JobController.getJobs);
router3.put(
  "/editjob/:id",
  AdminMiddleware,
  JobController.updateJob
);
router3.delete(
  "/deletejob/:id",
  AdminMiddleware,
  JobController.deleteJob
);

module.exports = router3;