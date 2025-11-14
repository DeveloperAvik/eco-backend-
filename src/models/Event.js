const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    maxParticipants: { type: Number, default: 50 },
    currentParticipants: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
