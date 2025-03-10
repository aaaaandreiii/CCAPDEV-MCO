const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, match: /@dlsu\.edu\.ph$/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], required: true },
  firstName: String,
  lastName: String,
  profilePicture: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
