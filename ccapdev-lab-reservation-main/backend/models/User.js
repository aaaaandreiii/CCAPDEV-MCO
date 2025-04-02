const mongoose = require('mongoose');
const { hashId } = require("../utils/hashUtils");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true, match: /@dlsu\.edu\.ph$/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], required: true },
  firstName: String,
  lastName: String,
  profilePicture: String,
  description: { type: String, maxlength: 300 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  hashedId: { type: String, unique: true }
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
      this.hashedId = hashId(this._id.toString());
  }
  next();
});

userSchema.index({ email: 1 });
module.exports = mongoose.model("User", userSchema);