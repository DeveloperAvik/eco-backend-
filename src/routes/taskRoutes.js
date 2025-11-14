const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const UserChallenge = require("../models/UserChallenge");
const auth = require("../middleware/auth");

// Get tasks for user in a challenge
router.get("/:challengeId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      challengeId: req.params.challengeId,
      userId: req.user.uid,
    }).sort({ order: 1, createdAt: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task (optional feature)
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.uid,
      completed: false,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark task complete + XP + streak
router.patch("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, userId: req.user.uid },
      { completed: true },
      { new: true }
    );

    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });

    const uc = await UserChallenge.findOne({
      userId: req.user.uid,
      challengeId: task.challengeId,
    });

    if (!uc)
      return res.status(404).json({ message: "User challenge not found" });

    const today = new Date();
    const last = uc.lastActiveDate ? new Date(uc.lastActiveDate) : today;
    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      uc.streak += 1;
    } else if (diffDays > 1) {
      uc.streak = 1;
    }

    uc.lastActiveDate = today;

    // XP
    const baseXP = 20;
    let multiplier = 1;

    if (uc.streak >= 3 && uc.streak <= 5) multiplier = 1.2;
    else if (uc.streak > 5) multiplier = 1.5;

    const earnedXP = Math.round(baseXP * multiplier);
    const previousXP = uc.xp || 0;
    uc.xp = previousXP + earnedXP;

    // Progress
    const totalTasks = await Task.countDocuments({
      challengeId: task.challengeId,
      userId: req.user.uid,
    });

    const completedTasks = await Task.countDocuments({
      challengeId: task.challengeId,
      userId: req.user.uid,
      completed: true,
    });

    const progressPercent = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    uc.progress = progressPercent;

    const prevLevel = uc.level || 1;
    const newLevel = Math.floor(1 + uc.xp / 100);
    uc.level = newLevel;
    const levelUp = newLevel > prevLevel;

    await uc.save();

    res.json({
      task,
      progress: progressPercent,
      xpEarned: earnedXP,
      newXP: uc.xp,
      streak: uc.streak,
      levelUp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
