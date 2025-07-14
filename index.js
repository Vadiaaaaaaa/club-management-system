const express = require("express")
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
const session = require("express-session");

app.use(session({
  secret: 'clubhub-secret',   // use a better secret in production
  resave: false,
  saveUninitialized: true
}));


const clubs = [
  {
    id: uuidv4(),
    name: "The AI & ML Club",
    shortDesc: "Explore the power of Artificial Intelligence and Machine Learning.",
    longDesc: "We aim to foster excellence in AI and ML by building a collaborative, growth-focused community. Through innovative projects and real-world applications, we empower students to develop impactful solutions, contribute to VIT and beyond, and make AI more accessible in everyday life.",
    image: "/images/ai-ml.jpg",
    linkedin: "ai-ml-club-vit",
    instagram: "aimlclub_vit",
    email: "aimlclub@vit.ac.in",
    teamStrength: 500,
    board: ["President: Aryan", "Vice-President: Neha", "Secretary: Rohan"],
    upcomingEvents: ["AI Hackathon", "ML Bootcamp"],
    pastEvents: ["Neural Network Day", "AI for Healthcare"],
    announcements: ["Recruitments open till 20th July!", "Team meeting on 25th July at 5 PM"]
  },
];


const user = {
  id: uuidv4(),
  name: "Vedika Saboo",
  email: "vedika@example.com",
  registeredEvents: [], // Array of event IDs the user is registered for
  completedEvents: [], // Array of event IDs the user has attended/completed
  yourClubs: [], // Array of club IDs the user is a core/member of
  clubsApplied: [
    {
      clubId: "club123",
      status: "pending" // can be "pending", "approved", "rejected"
    }
  ],
  yourClubEvents: [], // Events created/hosted by clubs the user is part of
  eventsThisWeek: [], // Array of events scheduled within the current week
  calendar: [], // Array of all upcoming events or personal event schedule
  eventHistory: [], // All past events attended or hosted
  announcements: [], // Announcements relevant to user's clubs or events
  feedbackGiven: [
    {
      eventId: "event456",
      comment: "Loved it!",
      rating: 4.5
    }
  ]
};


const events = [
  {
    id: uuidv4(),
    club: "VIT Music Club",
    eventName: "Midnight Melodies",
    shortDesc: "An overnight song-writing competition",
    longDesc: "Midnight Melodies is your chance to dive deep into the world of music, surrounded by passionate musicians. Spend the entire night crafting original songs, experimenting with melodies, and collaborating with fellow participants. Whether you are a seasoned songwriter or just starting, this event promises an inspiring and immersive experience. Enjoy workshops, jam sessions, and open mics throughout the night, all within a supportive community. End the night with performances that showcase your creations. Let's make the night unforgettable with rhythm, creativity, and collaboration.",
    date: "12th July 2025",
    registered: 28,
    capacity: 50,
    image: "/images/music.jpg"
  },
  {
    id: uuidv4(),
    club: "Volleyball Club",
    eventName: "Spike Showdown",
    shortDesc: "Volleyball Tournament Against your friends",
    longDesc: "Spike Showdown is the ultimate volleyball tournament where you face off against your friends and peers in a spirited competition. Gather your team and bring your best serves, spikes, and blocks to the court. This inter-club event is designed for both seasoned players and enthusiastic beginners who want to showcase their skills and have fun. Expect an atmosphere filled with energy, sportsmanship, and cheering crowds. Prizes await the top teams, but the real reward is the thrill of the game and the memories made along the way. Join and play hard!",
    date: "20th July 2025",
    registered: 18,
    capacity: 50,
    image: "/images/volley1.jpg"
  },
  {
    id: uuidv4(),
    club: "Astronomy Club",
    eventName: "Stellar Nights",
    shortDesc: "Watch the stars at night idk",
    longDesc: "Stellar Nights invites you to an enchanting stargazing experience under the clear night sky. Join astronomy enthusiasts and experts as we explore constellations, planets, and distant galaxies through telescopes and guided sessions. Whether you are a seasoned stargazer or simply curious about the cosmos, this event offers a peaceful yet educational escape. Learn about the myths and science behind celestial bodies, and capture the beauty of the night sky. Don’t miss the chance to make a wish upon a shooting star and share this cosmic adventure with fellow space lovers.",
    date: "13th July 2025",
    registered: 21,
    capacity: 50,
    image: "/images/astro.jpg"
  },
  {
    id: uuidv4(),
    club: "Volleyball Club",
    eventName: "Volley Remix",
    shortDesc: "Volleyball Tournament Against your friends",
    longDesc: "Volley Remix returns with another exciting round of matches. Whether you played in the last tournament or missed it, this is your chance to showcase your growth and sportsmanship. Teams will compete with renewed energy, aiming to claim the championship title. Expect intense serves, fast-paced rallies, and strategic plays that will keep everyone on their toes. This event is more than just a game—it's a celebration of teamwork, agility, and competitive spirit. Bring your friends to cheer you on and make this tournament another memorable chapter in your volleyball journey.",
    date: "30th July 2025",
    registered: 18,
    capacity: 50,
    image: "/images/volley2.jpg"
  },
  {
    id: uuidv4(),
    club: "Photography Club",
    eventName: "Green Lens Walk",
    shortDesc: "Nature Photography Walk",
    longDesc: "Join the Green Lens Walk, a refreshing journey through the lush greenery of the campus designed for photography enthusiasts. Discover hidden nooks, vibrant flora, and picturesque landscapes perfect for capturing stunning nature shots. Our guides will share tips on composition, lighting, and perspective to help you elevate your photography skills. Whether you're using a DSLR or a smartphone, this walk is for everyone who loves blending nature with art. Share your best shots in our post-walk showcase and connect with fellow shutterbugs who share your passion for the natural world.",
    date: "15th July 2025",
    registered: 34,
    capacity: 50,
    image: "/images/photowalk.jpg"
  },

];




app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


app.use(express.static(path.join(__dirname, "public")))

app.listen(port, ()=>{
   console.log(`app listening on port ${port}`);
})

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render("login")
})


app.get("/events", (req, res) => {
  const registeredEvents = req.session.registeredEvents || [];
  res.render("events", { events, registeredEvents });
});


app.post("/events/:id/register", (req, res) => {
  const { id } = req.params;
  const event = events.find(e => e.id.trim() === id.trim());

  if (!event) {
    return res.status(404).send("Event not found");
  }

  if (!req.session.registeredEvents) {
    req.session.registeredEvents = [];
  }

  const alreadyRegistered = req.session.registeredEvents.includes(event.id);

  if (!alreadyRegistered && event.registered < event.capacity) {
    event.registered++;
    user.registeredEvents.push(id);
    req.session.registeredEvents.push(event.id);
  }

  res.redirect("/events");
});

app.get("/events/:id", (req, res) => {
  const { id } = req.params;
  const event = events.find(e => e.id === id);

  if (!event) return res.status(404).send("Event not found");

  res.render("event-details", {
    event,
    registeredEvents: user.registeredEvents
  });
});

app.get("/clubs/:id", (req, res) => {
  const { id } = req.params;
  const club = clubs.find(c => c.id === id);
  if (!club) return res.status(404).send("Club not found");
  res.render("club-details", { club });
});

app.get("/clubs", (req, res) => {
  res.render("clubs", { clubs });
});