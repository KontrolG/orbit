const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true },
  userId: { type: mongoose.ObjectId, required: true }
});

module.exports = mongoose.model("token", tokenSchema);
