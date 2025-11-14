const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserChallenge = require("../models/UserChallenge");
const Task = require("../models/Task");

// List challenges
router.get("/", auth, async (req, res) => {
  try {
    const items = await UserChallenge.find({ userId: req.user.uid });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a challenge & recompute progress
router.patch("/:id", auth, async (req, res) => {
  try {
    const uc = await UserChallenge.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!uc) return res.status(404).json({ message: "User challenge not found" });

    Object.assign(uc, req.body);

    const total = await Task.countDocuments({
      challengeId: uc.challengeId,
      userId: req.user.uid,
    });

    const completed = await Task.countDocuments({
      challengeId: uc.challengeId,
      userId: req.user.uid,
      completed: true,
    });

    if (total > 0) {
      uc.progress = Math.round((completed / total) * 100);
    }

    if (uc.progress === 100) {
      uc.status = "Completed";
    }

    await uc.save();

    res.json({ message: "Challenge updated", challenge: uc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
