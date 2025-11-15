require("dotenv").config();
const mongoose = require("mongoose");
const Tip = require("./src/models/Tip");

const tips = [
  {
    title: "Unplug Your Chargers",
    tip: "Chargers continue to draw power even when not connected to a device. Unplug them to save energy.",
    category: "Energy",
  },
  {
    title: "Go Paperless",
    tip: "Opt for digital bills and statements to save trees and reduce waste.",
    category: "Waste",
  },
  {
    title: "Use a Reusable Water Bottle",
    tip: "Reduce plastic waste by using a reusable water bottle instead of buying bottled water.",
    category: "Waste",
  },
  {
    title: "Take Shorter Showers",
    tip: "Cutting down your shower time by just a few minutes can save a significant amount of water.",
    category: "Water",
  },
  {
    title: "Switch to LED Bulbs",
    tip: "LED bulbs use up to 80% less energy than traditional incandescent bulbs and last much longer.",
    category: "Energy",
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Tip.deleteMany({});
  await Tip.insertMany(tips);
  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDB();
