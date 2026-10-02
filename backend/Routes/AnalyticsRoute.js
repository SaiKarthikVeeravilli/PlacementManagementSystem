const express = require("express");

const router7 = express.Router();

const AnalyticsController =
  require("../Controllers/AnalyticsController");

const AdminMiddleware =
  require("../Middlewares/AdminMiddleware");


// Admin → Placement Analytics

router7.get(
  "/admin/analytics",
  AdminMiddleware,
  AnalyticsController.getAnalytics
);


module.exports = router7;