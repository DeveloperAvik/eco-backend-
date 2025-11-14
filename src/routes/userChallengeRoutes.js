const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserChallenge = require("../models/UserChallenge");

// LIST user challenges
router.get("/", auth, async (req, res) => {
  const items = await UserChallenge.find({ userId: req.user.uid });
  res.json(items);
});

// UPDATE progress
router.patch("/:id", auth, async (req, res) => {
  const updated = await UserChallenge.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
