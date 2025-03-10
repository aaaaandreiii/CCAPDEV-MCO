const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  capacity: Number,
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lab', labSchema);
