const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const labRoutes = require('./routes/labRoutes');
const PORT = process.env.PORT || 5000;
const app = express();
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" }
});

require('dotenv').config();

app.use(cors());
app.use(express.json());

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/labs', labRoutes);  // ✅ Ensure correct route

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

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
  API_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com/api' : 'http://localhost:5000/api',
};

// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const socketIo = require('socket.io');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const reservationRoutes = require('./routes/reservationRoutes');
// const labRoutes = require('./routes/labRoutes');
// const routes = require('./routes/auth');

// const app = express();
// const server = http.createServer(app); // Create server for WebSockets
// const io = socketIo(server, { cors: { origin: "http://localhost:3000" } }); // Allow frontend to connect

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)//, 
//   // { 
//   // useNewUrlParser: true, useUnifiedTopology: true 
//   // })
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// app.use('/api', authRoutes);
// app.use('/api', reservationRoutes);
// app.use('/api', labRoutes);

// //the magical WebSocket connection
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// //make io available to other files
// app.set('io', io);
// // app.use('/api', routes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
