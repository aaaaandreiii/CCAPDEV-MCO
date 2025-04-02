const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const labRoutes = require("./routes/labRoutes");
const seatsRoutes = require("./routes/seatsRoutes");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const io = require("socket.io")(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use("/api/seats", seatsRoutes);

// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/User', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//   }).then(() => console.log("✅ Database Connected"))
//   .catch(err => console.error("❌ Database Connection Error:", err));


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/User', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/labs", labRoutes);

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
      ? "https://CCAPDEV-production-url.com/api"
      : "http://localhost:5000/api",
};
