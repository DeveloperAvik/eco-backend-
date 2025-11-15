const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Tip = require("../models/Tip");

// Latest 5 tips
router.get("/", async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 }).limit(5);
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create tip
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const tip = await Tip.create({
      title,
      content,
      category: category || "General",
      author: req.user.email,
      authorName: req.user.email,
    });

    res.status(201).json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Random tip
router.get("/random", async (req, res) => {
  try {
    const count = await Tip.countDocuments();
    const random = Math.floor(Math.random() * count);
    const tip = await Tip.findOne().skip(random);
    res.json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
