const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require("../Controllers/NotificationController");

const AuthMiddleware = require("../Middlewares/AuthMidlleware");

const router6 = express.Router();

router6.get(
  "/notifications",
  AuthMiddleware,
  getNotifications
);

router6.get(
  "/notifications/unread-count",
  AuthMiddleware,
  getUnreadCount
);

router6.put(
  "/notifications/:id/read",
  AuthMiddleware,
  markAsRead
);
router6.put(
  "/notifications/read-all",
  AuthMiddleware,
  markAllAsRead
);

module.exports = router6;