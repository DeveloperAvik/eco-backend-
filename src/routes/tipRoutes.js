const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Tip = require("../models/Tip");

// GET latest 5 tips
router.get("/", async (req, res) => {
  const tips = await Tip.find().sort({ createdAt: -1 }).limit(5);
  res.json(tips);
});

// CREATE tip
router.post("/", auth, async (req, res) => {
  const tip = await Tip.create({
    ...req.body,
    author: req.user.email,
  });
  res.status(201).json(tip);
});

module.exports = router;
