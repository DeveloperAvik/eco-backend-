const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const challengeRoutes = require("./routes/challengeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const tipRoutes = require("./routes/tipRoutes");
const userChallengeRoutes = require("./routes/userChallengeRoutes");
const carbonRoutes = require("./routes/carbonRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/challenges", challengeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/user-challenges", userChallengeRoutes);
app.use("/api/carbon", carbonRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.get("/", (req, res) => {
  res.send("Eco Project API is running");
});

module.exports = app;
