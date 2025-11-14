const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const CarbonLog = require("../models/CarbonLog");
const Offset = require("../models/Offset");

// CALCULATE carbon + log it
router.post("/calc", auth, async (req, res) => {
  const { category, value } = req.body;
  let carbon = 0;

  if (category === "streaming") carbon = value * 36;
  if (category === "browsing") carbon = value * 20;
  if (category === "device") carbon = value * 50;
  if (category === "data") carbon = value * 55;

  await CarbonLog.create({
    userId: req.user.uid,
    amount: carbon,
    category,
    meta: { value }
  });

  res.json({ carbon });
});

// TODAY total
router.get("/today", auth, async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const logs = await CarbonLog.aggregate([
    { $match: { userId: req.user.uid, createdAt: { $gte: start } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({ total: logs[0]?.total || 0 });
});

// WEEK stats
router.get("/stats", auth, async (req, res) => {
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const stats = await CarbonLog.aggregate([
    { $match: { userId: req.user.uid, createdAt: { $gte: start } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);

  res.json(stats);
});

// CREATE carbon offset
router.post("/offset", auth, async (req, res) => {
  const { amount, method } = req.body;

  await Offset.create({
    userId: req.user.uid,
    amount,
    method
  });

  res.json({ message: "Offset recorded" });
});

module.exports = router;
