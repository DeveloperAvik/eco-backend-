const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Event = require("../models/Event");

// Upcoming 4 events
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(4);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxParticipants: maxParticipants || 50,
      organizer: req.user.email,
      currentParticipants: 0,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
