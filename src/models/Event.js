const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  organizer: String,
  maxParticipants: Number,
  currentParticipants: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
