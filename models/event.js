const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const eventSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  club: String,
  eventName: String,
  shortDesc: String,
  longDesc: String,
  date: String,
  venue: String,
  time: String,
  registered: { type: Number, default: 0 },
  capacity: Number,
  image: String
});

module.exports = mongoose.model("Event", eventSchema);
