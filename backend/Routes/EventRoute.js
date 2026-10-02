const express = require("express");

const router8 = express.Router();

const EventController = require("../Controllers/EventController");

const AdminMiddleware = require("../Middlewares/AdminMiddleware");

const AuthMiddleware = require("../Middlewares/AuthMidlleware");


// Admin → Create event

router8.post(
  "/admin/events",
  AdminMiddleware,
  EventController.createEvent
);


// Student → View events

router8.get(
  "/events",
  AuthMiddleware,
  EventController.getEvents
);


module.exports = router8;