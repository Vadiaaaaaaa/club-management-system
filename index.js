const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const mongoose = require("mongoose");

const Club = require("./models/club");
const Event = require("./models/event");
const User = require("./models/user");

// MongoDB
require('dotenv').config();
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch(err => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({
  secret: 'clubhub-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Authentication middleware
function isLoggedIn(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function isAdmin(req, res, next) {
  if (req.session.role !== "admin") return res.status(403).send("Not authorized");
  next();
}

// Home
app.get("/", (req, res) => {
  res.render("home", { role: req.session.role });
});

// Register/Login
app.get("/register", (req, res) => res.render("register"));

app.post("/register", async (req, res) => {
  const { name, email, username, password, role } = req.body;

  const user = new User({
    name,
    email,
    username,
    password,
    role: role || "user"
  });

  await user.save();
  req.session.userId = user._id;
  req.session.role = user.role;

  res.redirect("/interests");
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.validatePassword(password))) {
    return res.send("Invalid credentials");
  }
  req.session.userId = user._id;
  req.session.role = user.role;
  res.redirect("/dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Interests (saved after signup)
app.get("/interests", isLoggedIn, (req, res) => {
  res.render("interests");
});

app.post("/interests", isLoggedIn, async (req, res) => {
  const selectedInterests = req.body.interests;
  const userId = req.session.userId;
  const interestsArray = Array.isArray(selectedInterests)
    ? selectedInterests
    : [selectedInterests];

  await User.findByIdAndUpdate(userId, { interests: interestsArray });
  res.redirect("/clubs");
});

// Club Recommendations (via tag matching)
app.get("/clubs", async (req, res) => {
  const allClubs = await Club.find({});
  let recommendedClubNames = [];
  let currentUser = null;

  if (req.session.userId) {
    currentUser = await User.findById(req.session.userId);
    const userInterests = currentUser?.interests || [];

    recommendedClubNames = allClubs
      .filter(club => club.tags?.some(tag => userInterests.includes(tag)))
      .map(club => club.name);
  }

  const recommendedClubs = allClubs.filter(club =>
    recommendedClubNames.includes(club.name)
  );
  const otherClubs = allClubs.filter(club =>
    !recommendedClubNames.includes(club.name)
  );

  const sortedClubs = [...recommendedClubs, ...otherClubs];

  res.render("clubs", {
    clubs: sortedClubs,
    recommendedClubs,
    recommendedClubNames,
    user: currentUser 
  });
});


app.get("/clubs/:id", async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).send("Club not found");
  res.render("club-details", { club });
});

// Events
app.get("/events", async (req, res) => {
  const events = await Event.find({});
  let registeredEvents = [];

  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    registeredEvents = user?.registeredEvents.map(e => e.toString()) || [];
  }

  res.render("events", { events, registeredEvents });
});


app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send("Event not found");

    let registeredEvents = [];
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      registeredEvents = user?.registeredEvents.map(e => e.toString()) || [];
    }

    res.render("event-details", { event, registeredEvents });
  } catch (err) {
    console.error("Event load error:", err);
    res.status(500).send("Something went wrong.");
  }
});
app.post("/events/:id/register", isLoggedIn, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.session.userId);

    if (!event || !user) {
      const message = "Event or user not found";
      return req.headers.accept.includes("application/json")
        ? res.status(404).json({ success: false, message })
        : res.status(404).send(message);
    }

    const alreadyRegistered = user.registeredEvents.some(
      ev => ev.toString() === req.params.id
    );

    const hasCapacity = event.registered < event.capacity;

    if (!alreadyRegistered && hasCapacity) {
      event.registered += 1;
      user.registeredEvents.push(event._id);
      await event.save();
      await user.save();
      req.session.registeredEvents = user.registeredEvents.map(e => e.toString());

      return req.headers.accept.includes("application/json")
        ? res.json({ success: true, registered: event.registered })
        : res.redirect("/events");
    }

    const message = "Already registered or event full";
    return req.headers.accept.includes("application/json")
      ? res.json({ success: false, message })
      : res.redirect("/events");

  } catch (err) {
    console.error("Event registration error:", err);
    return req.headers.accept.includes("application/json")
      ? res.status(500).json({ success: false, message: "Internal error" })
      : res.status(500).send("Something went wrong.");
  }
});


// Dashboard
app.get("/dashboard", isLoggedIn, async (req, res) => {
  const currentUser = await User.findById(req.session.userId)
    .populate("registeredEvents")
    .exec();

  if (!currentUser) return res.redirect("/login");

  const events = await Event.find({});
  const clubs = await Club.find({});
  const registeredEvents = currentUser.registeredEvents.map(e => e._id.toString()) || [];

  const clubNames = currentUser.yourClubs?.map(c => c.name) || [];

  const userClubsWithAnnouncements = await Club.find(
    { name: { $in: clubNames } },
    { name: 1, announcements: 1, _id: 0 }
  );

  res.render("dashboard", {
    user: currentUser,
    events,
    clubs,
    registeredEvents,
    role: req.session.role,
    userClubsWithAnnouncements
  });
});

// Admin-only route example
app.get("/admin/create-club", isLoggedIn, isAdmin, (req, res) => {
  res.send("This page is only visible to admins.");
});


app.post("/clubs/:id/apply", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.userId);
  const club = await Club.findById(req.params.id);

  if (!user || !club) {
    return res.status(404).send("User or Club not found");
  }

  // Add join request
  club.joinRequests.push({
    name: user.name,
    email: user.email
  });
  await club.save();

  const alreadyApplied = user.clubsApplied.some(c => c.name === club.name);
  if (!alreadyApplied) {
    user.clubsApplied.push({ name: club.name, status: "pending" });
    await user.save();
  }

  // ✅ You forgot this!
  res.redirect("/clubs");
});

