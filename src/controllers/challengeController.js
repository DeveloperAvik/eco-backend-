const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");

exports.getChallenges = async (req, res) => {
  try {
    const { categories, start_gte, start_lte, participants_gte, participants_lte } = req.query;

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

exports.getChallenge = async (req, res) => {
  const c = await Challenge.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
};

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

exports.updateChallenge = async (req, res) => {
  const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteChallenge = async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const exists = await UserChallenge.findOne({
      userId: req.user.uid,
      challengeId,
    });

    if (exists) return res.status(400).json({ message: "Already joined" });

    const userC = await UserChallenge.create({
      userId: req.user.uid,
      challengeId,
      status: "Ongoing",
      progress: 0,
    });

    const challenge = await Challenge.findById(challengeId);
    challenge.participants += 1;
    await challenge.save();

    res.json({ message: "Joined successfully", userChallenge: userC });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
