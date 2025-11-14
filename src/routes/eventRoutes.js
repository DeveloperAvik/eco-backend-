const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Event = require("../models/Event");

// GET 4 upcoming events
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 }).limit(4);
  res.json(events);
});

// CREATE event
router.post("/", auth, async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user.email,
  });
  res.status(201).json(event);
});

module.exports = router;
