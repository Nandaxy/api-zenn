const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 1 },
  secret: { type: String },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
