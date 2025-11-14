require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ EcoPulse backend running on port ${PORT}`);
});
