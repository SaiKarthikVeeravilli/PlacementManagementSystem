const express = require("express");

const router4 = express.Router();

const ApplicationController = require("../Controllers/ApplicationController");
const AuthMiddleware = require("../Middlewares/AuthMidlleware");
const AdminMiddleware = require("../Middlewares/AdminMiddleware");


// Student applies for a job
router4.post(
  "/apply",
  AuthMiddleware,
  ApplicationController.applyJob
);


// Student views own applications
router4.get(
  "/myapplications",
  AuthMiddleware,
  ApplicationController.getMyApplications
);


// Admin views all applications
router4.get(
  "/allapplications",
  AdminMiddleware,
  ApplicationController.getAllApplications
);


// Admin changes application status
router4.patch(
  "/updatestatus/:applicationID",
  AdminMiddleware,
  ApplicationController.updateApplicationStatus
);
router4.get(
  "/dashboard-stats",
  AuthMiddleware,
  ApplicationController.getDashboardStats
);


module.exports = router4;