const express = require("express");

const router8 = express.Router();

const ReportController =
  require("../Controllers/ReportController");

const AdminMiddleware =
  require("../Middlewares/AdminMiddleware");


// Admin → Placement Report

router8.get(
  "/admin/report",
  AdminMiddleware,
  ReportController.getPlacementReport
);
router8.get(
  "/admin/report/pdf",
  AdminMiddleware,
  ReportController.downloadPlacementReport
);


module.exports = router8;