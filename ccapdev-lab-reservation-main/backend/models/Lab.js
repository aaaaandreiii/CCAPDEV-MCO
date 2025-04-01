const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true, min: 1 },
  location: { type: String, required: true },
  description: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

labSchema.index({ name: 1 });
module.exports = mongoose.model('Lab', labSchema);