const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // ✅ Import http module
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const labRoutes = require("./routes/labRoutes");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app); // ✅ Create the server before using socket.io
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5000" }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/labs", labRoutes);

// Start the server using `server.listen`
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new-reservation", (data) => {
    io.emit("update-reservations", data);
  });

  socket.on("delete-reservation", (reservationId) => {
    io.emit("reservation-deleted", reservationId);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

module.exports = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-production-url.com/api"
      : "http://localhost:5000/api",
};
