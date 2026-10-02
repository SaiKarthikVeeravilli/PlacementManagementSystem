const express = require("express");
const router5 = express.Router();

const AdminDashboardController = require("../Controllers/AdminDashBoardController");
const AdminMiddleware = require("../Middlewares/AdminMiddleware");

router5.get(
  "/admin/dashboard-stats",
  AdminMiddleware,
  AdminDashboardController.getAdminDashboardStats
);

module.exports = router5;