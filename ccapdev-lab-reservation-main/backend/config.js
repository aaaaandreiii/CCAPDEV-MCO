require("dotenv").config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/lab_reservations",
};