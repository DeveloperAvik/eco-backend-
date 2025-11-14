const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserChallenge = require("../models/UserChallenge");

// GET /api/leaderboard
router.get("/", auth, async (req, res) => {
  try {
    const rows = await UserChallenge.aggregate([
      {
        $group: {
          _id: "$userId",
          totalXP: { $sum: "$xp" },
          maxStreak: { $max: "$streak" },
          challengesCount: { $sum: 1 },
        },
      },
      { $sort: { totalXP: -1, maxStreak: -1 } },
      { $limit: 20 },
    ]);

    const shaped = rows.map((r) => ({
      userId: r._id,
      totalXP: r.totalXP || 0,
      maxStreak: r.maxStreak || 0,
      challengesCount: r.challengesCount || 0,
    }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
