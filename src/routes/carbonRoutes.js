const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const CarbonLog = require("../models/CarbonLog");
const Offset = require("../models/Offset");
const UserChallenge = require("../models/UserChallenge");

const CARBON_FACTORS = {
  streaming: 36,
  browsing: 20,
  device: 50,
  data: 55,
};

function getLevelFromXP(xp) {
  return Math.floor(1 + xp / 100);
}

// Log carbon
router.post("/calc", auth, async (req, res) => {
  const { category, value } = req.body;

  const factor = CARBON_FACTORS[category] || 25;
  const carbon = value * factor;

  await CarbonLog.create({
    userId: req.user.uid,
    amount: carbon,
    category,
    meta: { value },
  });

  res.json({ carbon });
});

// Today total + optional XP for low-carbon day
router.get("/today", auth, async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const logs = await CarbonLog.aggregate([
    { $match: { userId: req.user.uid, createdAt: { $gte: start } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const total = logs[0]?.total || 0;

  // Low-carbon bonus XP
  const todaysChallenges = await UserChallenge.find({
    userId: req.user.uid,
    status: "Ongoing",
  });

  const rewards = [];

  for (let uc of todaysChallenges) {
    let xpGain = 0;

    if (total <= 80) xpGain = 8;
    else if (total <= 150) xpGain = 3;

    const today = new Date().toDateString();
    const last = uc.lastActiveDate
      ? new Date(uc.lastActiveDate).toDateString()
      : null;

    if (xpGain > 0 && today !== last) {
      const prevXP = uc.xp || 0;
      const newXP = prevXP + xpGain;
      const oldLevel = uc.level || 1;
      const newLevel = getLevelFromXP(newXP);
      const levelUp = newLevel > oldLevel;

      uc.xp = newXP;
      uc.level = newLevel;
      uc.lastActiveDate = new Date();
      await uc.save();

      rewards.push({
        challengeId: uc.challengeId,
        xpGain,
        newXP,
        levelUp,
      });
    }
  }

  res.json({ total, rewards });
});

// Weekly stats by category
router.get("/stats", auth, async (req, res) => {
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const stats = await CarbonLog.aggregate([
    { $match: { userId: req.user.uid, createdAt: { $gte: start } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  res.json(stats);
});

// Logs for timeline
router.get("/logs", auth, async (req, res) => {
  const logs = await CarbonLog.find({ userId: req.user.uid }).sort({
    createdAt: -1,
  });

  res.json(logs);
});

// Offset
router.post("/offset", auth, async (req, res) => {
  const { amount, method } = req.body;

  await Offset.create({
    userId: req.user.uid,
    amount,
    method,
  });

  res.json({ message: "Offset recorded" });
});

// Week & month projection
router.get("/month-projection", auth, async (req, res) => {
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const logs = await CarbonLog.aggregate([
    { $match: { userId: req.user.uid, createdAt: { $gte: start } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const total7 = logs[0]?.total || 0;
  const avg = total7 / 7;

  res.json({
    week: Math.round(avg * 7),
    month: Math.round(avg * 30),
  });
});

module.exports = router;
