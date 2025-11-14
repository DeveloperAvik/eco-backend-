const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const challengeRoutes = require("./routes/challengeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const tipRoutes = require("./routes/tipRoutes");
const userChallengeRoutes = require("./routes/userChallengeRoutes");
const carbonRoutes = require("./routes/carbonRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // you can restrict to your frontend domain later
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization, x-user-id, x-user-email",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Root
app.get("/", (req, res) => {
  res.send("🌱 EcoPulse API is running");
});

// API Routes
app.use("/api/challenges", challengeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/user-challenges", userChallengeRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
