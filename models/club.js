const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const clubSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },

  name: {
    type: String,
    required: true,
    unique: true
  },

  shortDesc: String,
  longDesc: String,
  image: String,

  linkedin: String,
  instagram: String,
  email: String,

  teamStrength: {
    type: Number,
    default: 0
  },

  board: [String], 
  
  upcomingEvents: [String], 
  pastEvents: [String],
  
  announcements: [String],

  tags: [String], 

  currentMembers: [
    {
      name: String,
      role: String
    }
  ],

  joinRequests: [
    {
      name: String,
      email: String
    }
  ]
});

module.exports = mongoose.model("Club", clubSchema);
