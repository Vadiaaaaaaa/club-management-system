const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  interests: [String], 

  yourClubs: [
    {
      name: String, // Club name
      role: String  
    }
  ],

  clubsApplied: [
    {
      name: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      }
    }
  ],

  // Club events the admin has created (if role is 'admin')
  yourClubEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

  // Events user has registered for
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

  completedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

  // Events user has saved for this week
  eventsThisWeek: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

  // User’s event history
  eventHistory: [
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      feedbackGiven: Boolean
    }
  ],

  // Feedback given by user
  feedback: [
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      rating: Number,
      comments: String
    }
  ],

  // Calendar integration
  calendar: [
    {
      date: Date,
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }
    }
  ],

  club: {
    name: String,
    logo: String,
    events: [
      {
        name: String,
        description: String,
        venue: String,
        capacity: Number,
        mode: { type: String, enum: ["online", "offline"] },
        bannerImg: String,
        status: { type: String, enum: ["published", "draft"] },
        registered: Number,
        date: Date
      }
    ]
  }
});

//Hashing Pwd
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//Check pwd during login
userSchema.methods.validatePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
