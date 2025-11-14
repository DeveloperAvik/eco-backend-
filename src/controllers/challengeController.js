const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const Task = require("../models/Task");

// ------------------------------
// GET ALL CHALLENGES
// ------------------------------
exports.getChallenges = async (req, res) => {
  try {
    const {
      categories,
      start_gte,
      start_lte,
      participants_gte,
      participants_lte,
    } = req.query;

    const filter = {};

    if (categories) filter.category = { $in: categories.split(",") };

    if (start_gte || start_lte) filter.startDate = {};
    if (start_gte) filter.startDate.$gte = new Date(start_gte);
    if (start_lte) filter.startDate.$lte = new Date(start_lte);

    if (participants_gte || participants_lte) filter.participants = {};
    if (participants_gte) filter.participants.$gte = Number(participants_gte);
    if (participants_lte) filter.participants.$lte = Number(participants_lte);

    const list = await Challenge.find(filter).sort({ startDate: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// GET ONE CHALLENGE
// ------------------------------
exports.getChallenge = async (req, res) => {
  const c = await Challenge.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
};

// ------------------------------
// CREATE CHALLENGE
// ------------------------------
exports.createChallenge = async (req, res) => {
  try {
    const c = await Challenge.create({
      ...req.body,
      createdBy: req.user.email,
    });
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------
// UPDATE CHALLENGE
// ------------------------------
exports.updateChallenge = async (req, res) => {
  const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// ------------------------------
// DELETE CHALLENGE
// ------------------------------
exports.deleteChallenge = async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// ==========================================================
// JOIN CHALLENGE (WITH AUTO TASKS + XP + STREAK SYSTEM)
// ==========================================================
exports.joinChallengeWithGamification = async (req, res) => {
  try {
    const challengeId = req.params.id;

    // Already joined?
    const exists = await UserChallenge.findOne({
      userId: req.user.uid,
      challengeId,
    });

    if (exists)
      return res
        .status(400)
        .json({ message: "Already joined this challenge" });

    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    // Create user challenge record
const userC = await UserChallenge.create({
  userId: req.user.uid,
  userEmail: req.user.email,
  userName: req.user.name,
  challengeId,
  status: "Ongoing",
  progress: 0,
  xp: 0,
  streak: 1,
  lastActiveDate: new Date(),
});


    // AUTO TASK GENERATOR based on duration
    let tasks = [];
    const duration = challenge.duration || 7;

    if (duration >= 30) {
      tasks = [
        "Prepare for sustainable lifestyle shift",
        "Reduce morning routine emissions",
        "Track daily digital usage",
        "Cut idle device usage",
        "Optimize weekly transport choices",
        "Weekend eco-review & reset",
      ];
    } else if (duration >= 14) {
      tasks = [
        "Plan sustainability approach",
        "Reduce daily waste footprint",
        "Mid-program reflection & optimize habits",
      ];
    } else if (duration >= 7) {
      tasks = ["Start challenge strong", "Mid-week emission check"];
    } else {
      tasks = [
        "Begin your eco journey",
        "Avoid one high-carbon activity today",
        "Track emissions for one full day",
        "Reflect & complete challenge",
      ];
    }

    const taskDocs = tasks.map((title, idx) => ({
      title,
      description: `${title} for ${challenge.title}`,
      challengeId,
      userId: req.user.uid,
      completed: false,
      order: idx + 1,
    }));

    await Task.insertMany(taskDocs);

    // Increase participants count
    challenge.participants += 1;
    await challenge.save();

    res.json({
      message: "Challenge joined successfully!",
      userChallenge: userC,
      tasksGenerated: tasks.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
