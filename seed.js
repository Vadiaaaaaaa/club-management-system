const mongoose = require("mongoose");
const Club = require("./models/club");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const dbURI = 'mongodb+srv://vedikasaboo:watermelon@clubmanagementsystem.lkwytla.mongodb.net/club-management?retryWrites=true&w=majority&appName=clubManagementSystem';

// 📅 EVENTS
const events = [
  {
    club: "The AI & ML Club",
    eventName: "AI Hackathon",
    shortDesc: "A thrilling AI coding showdown",
    longDesc: "Join us for an intense AI hackathon where you’ll tackle real-world problems using machine learning.",
    date: "2025-07-25",
    registered: 0,
    capacity: 50,
    image: "/images/ai-event.jpg"
  },
  {
    club: "The AI & ML Club",
    eventName: "ML Bootcamp",
    shortDesc: "Learn ML from scratch",
    longDesc: "A bootcamp for beginners in machine learning.",
    date: "2025-07-28",
    registered: 0,
    capacity: 50,
    image: "/images/ai-event2.jpg"
  },
  {
    club: "The Coding Club",
    eventName: "CodeStorm 2.0",
    shortDesc: "Level up your coding skills",
    longDesc: "Solve algorithmic challenges and win cool prizes!",
    date: "2025-07-24",
    registered: 0,
    capacity: 50,
    image: "/images/codestorm.jpg"
  },
  {
  club: "Cybersecurity Club",
  eventName: "HackTheBox Showdown",
  shortDesc: "Solve security challenges live",
  longDesc: "Participate in an exciting CTF-style event hosted with HackTheBox scenarios.",
  date: "2025-07-26",
  registered: 0,
  capacity: 40,
  image: "/images/hackthebox.jpg"
},
{
  club: "Cybersecurity Club",
  eventName: "Web Security Workshop",
  shortDesc: "Learn OWASP Top 10 hands-on",
  longDesc: "A beginner-friendly workshop on common web vulnerabilities and prevention techniques.",
  date: "2025-07-29",
  registered: 0,
  capacity: 60,
  image: "/images/websec.jpg"
},
{
  club: "Game Development Club",
  eventName: "Unity Game Jam",
  shortDesc: "Make your own game in 48 hours",
  longDesc: "Join us for an intense weekend game jam using Unity. All levels welcome!",
  date: "2025-07-30",
  registered: 0,
  capacity: 30,
  image: "/images/unityjam.jpg"
},
{
  club: "Game Development Club",
  eventName: "Pixel Art Workshop",
  shortDesc: "Design assets for your games",
  longDesc: "Learn pixel art fundamentals for game assets using tools like Aseprite.",
  date: "2025-07-27",
  registered: 0,
  capacity: 25,
  image: "/images/pixelart.jpg"
},
{
  club: "Public Speaking Society",
  eventName: "Debate Duel",
  shortDesc: "Face off in a verbal battle",
  longDesc: "Participants will go head-to-head in live debates judged by expert panels.",
  date: "2025-07-23",
  registered: 0,
  capacity: 50,
  image: "/images/debateduel.jpg"
},
{
  club: "Public Speaking Society",
  eventName: "MUN Vellore",
  shortDesc: "Model United Nations, VIT edition",
  longDesc: "Represent countries and discuss global issues. Open to all students.",
  date: "2025-07-31",
  registered: 0,
  capacity: 100,
  image: "/images/munvellore.jpg"
},
{
  club: "Finance & Investment Club",
  eventName: "Stock Market Simulation",
  shortDesc: "Real trades. Fake money.",
  longDesc: "A competitive simulation to learn stock trading in a safe, fun environment.",
  date: "2025-07-21",
  registered: 0,
  capacity: 60,
  image: "/images/stocksim.jpg"
},
{
  club: "Culinary Club",
  eventName: "Masterchef VIT",
  shortDesc: "Cook-off challenge!",
  longDesc: "Compete in teams and present dishes to our student chef jury.",
  date: "2025-07-22",
  registered: 0,
  capacity: 30,
  image: "/images/masterchef.jpg"
},
{
  club: "Photography Club",
  eventName: "PhotoWalk: Campus Colors",
  shortDesc: "Capture campus in frames",
  longDesc: "Join us on a guided photo walk across VIT to explore light, texture, and story.",
  date: "2025-07-26",
  registered: 0,
  capacity: 25,
  image: "/images/photowalk.jpg"
},
{
  club: "Drama Club",
  eventName: "Street Play Showcase",
  shortDesc: "Drama with a message",
  longDesc: "Perform in an open-space act addressing social issues and human emotions.",
  date: "2025-07-27",
  registered: 0,
  capacity: 50,
  image: "/images/streetplay.jpg"
},
{
  club: "Quiz Club",
  eventName: "Pop Culture Quiz",
  shortDesc: "Movies, memes, music & more",
  longDesc: "Form a team and show off your pop culture knowledge. From Taylor Swift to Star Wars!",
  date: "2025-07-28",
  registered: 0,
  capacity: 70,
  image: "/images/popquiz.jpg"
}];

// 🤖 CLUBS
const clubs = [
  {
    name: "The AI & ML Club",
    shortDesc: "Explore the power of Artificial Intelligence and Machine Learning.",
    longDesc: "We empower students to build intelligent systems and solve real problems.",
    image: "/images/ai-ml.jpg",
    linkedin: "ai-ml-club-vit",
    instagram: "aimlclub_vit",
    email: "aimlclub@vit.ac.in",
    teamStrength: 500,
    board: ["President: Aryan", "Vice-President: Neha", "Secretary: Rohan"],
    upcomingEvents: ["AI Hackathon", "ML Bootcamp"],
    pastEvents: ["Neural Network Day", "AI for Healthcare"],
    announcements: [
      "Recruitments open till 20th July!",
      "Team meeting on 25th July at 5 PM",
      "Next ML workshop scheduled for 25th July!",
      "All members to update their GitHub profiles by Friday"
    ],
    tags: ["AI", "Coding"],
    currentMembers: [
      { name: "Vedika Saboo", role: "President" },
      { name: "Kriti Sharma", role: "Design Head" }
    ],
    joinRequests: [
      { name: "Ananya Mehra", email: "ananya@example.com" },
      { name: "Rohan Patel", email: "rohan@example.com" }
    ]
  },
  {
    name: "The Coding Club",
    shortDesc: "Sharpen your coding skills and crack the toughest problems.",
    longDesc: "We help students excel in coding contests and interviews.",
    image: "/images/coding.jpg",
    linkedin: "coding-club-vit",
    instagram: "vitcodingclub",
    email: "codingclub@vit.ac.in",
    teamStrength: 300,
    board: ["President: Tanmay", "Vice-President: Isha", "Secretary: Dev"],
    upcomingEvents: ["CodeStorm 2.0"],
    pastEvents: ["AlgoRush", "Crack the Code"],
    announcements: ["Contest this Sunday at 7 PM!", "Join our CP track now"],
    tags: ["Coding"],
    currentMembers: [],
    joinRequests: []
  },
  {
    name: "Design Club",
    shortDesc: "Where ideas come to life visually.",
    longDesc: "We explore UI/UX, graphics, and animation through projects and workshops.",
    image: "/images/design.jpg",
    linkedin: "design-club-vit",
    instagram: "vit.designclub",
    email: "designclub@vit.ac.in",
    teamStrength: 180,
    board: ["President: Kavya", "Vice-President: Ritvik", "Secretary: Sana"],
    upcomingEvents: ["Figma Jam", "Branding Workshop"],
    pastEvents: ["Design Sprint '24", "PosterPalooza"],
    announcements: ["Submissions close 17th July", "Figma plugin tutorial tomorrow"],
    tags: ["Literary Arts"],
    currentMembers: [],
    joinRequests: []
  },
  {
  name: "Cybersecurity Club",
  shortDesc: "Protect, Prevent, and Penetrate with purpose.",
  longDesc: "We focus on ethical hacking, cyber laws, and digital defense mechanisms through hands-on workshops and CTFs.",
  image: "/images/cybersecurity.jpg",
  linkedin: "cyber-club-vit",
  instagram: "vitcyberclub",
  email: "cyberclub@vit.ac.in",
  teamStrength: 250,
  board: ["President: Ayaan", "Vice-President: Shruti", "Secretary: Raj"],
  upcomingEvents: ["HackTheBox Showdown", "Web Security Workshop"],
  pastEvents: ["CTF Mayhem", "CyberTalks 101"],
  announcements: ["Bring your laptops for the workshop!", "Submit your writeups by 19th July"],
  tags: ["Cybersecurity", "Coding"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Game Development Club",
  shortDesc: "Build worlds. Design adventures.",
  longDesc: "We create games from scratch using Unity, Unreal Engine, and host game jams regularly.",
  image: "/images/game-dev.jpg",
  linkedin: "gamedev-vit",
  instagram: "vitgamedevclub",
  email: "gamedev@vit.ac.in",
  teamStrength: 150,
  board: ["President: Mehul", "Vice-President: Anika", "Secretary: Karthik"],
  upcomingEvents: ["Unity Game Jam", "Pixel Art Workshop"],
  pastEvents: ["Ludum Dare Sprint", "Gamers' Expo"],
  announcements: ["New members onboarded!", "Assets pack shared on Discord"],
  tags: ["Gaming", "Coding"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Public Speaking Society",
  shortDesc: "Speak. Influence. Lead.",
  longDesc: "We host debates, MUNs, and public speaking bootcamps to build confident orators.",
  image: "/images/public-speaking.jpg",
  linkedin: "speak-vit",
  instagram: "vitspeakersclub",
  email: "speakers@vit.ac.in",
  teamStrength: 120,
  board: ["President: Tara", "Vice-President: Arjun", "Secretary: Leena"],
  upcomingEvents: ["MUN Vellore", "Debate Duel"],
  pastEvents: ["Speakathon", "Voice of VIT"],
  announcements: ["First round of auditions on 18th July", "Orientation on 21st July"],
  tags: ["Public Speaking", "Literary Arts"],
  currentMembers: [],
  joinRequests: []
}, 
{
  name: "Finance & Investment Club",
  shortDesc: "Master the art of money.",
  longDesc: "We explore stock markets, crypto, and financial literacy through seminars and simulations.",
  image: "/images/finance.jpg",
  linkedin: "finance-club-vit",
  instagram: "vitfinclub",
  email: "finclub@vit.ac.in",
  teamStrength: 200,
  board: ["President: Aditya", "Vice-President: Harshini", "Secretary: Manav"],
  upcomingEvents: ["Stock Market Simulation", "CryptoTalks"],
  pastEvents: ["FinFest 2024", "Budget Breakdown 2025"],
  announcements: ["Finance quiz live on Instagram", "Charting tutorial session on 22nd July"],
  tags: ["Finance", "Startups"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Culinary Club",
  shortDesc: "Cook. Share. Celebrate.",
  longDesc: "We bring foodies together to learn, experiment, and compete in cooking battles.",
  image: "/images/culinary.jpg",
  linkedin: "culinary-club-vit",
  instagram: "vitculinaryclub",
  email: "culinary@vit.ac.in",
  teamStrength: 130,
  board: ["President: Rhea", "Vice-President: Abhay", "Secretary: Zara"],
  upcomingEvents: ["Masterchef VIT", "No-Fire Recipes Workshop"],
  pastEvents: ["Bake-a-thon", "Food Truck Fest"],
  announcements: ["Submit your recipe video by 20th July!", "Tasting Panel volunteers needed"],
  tags: ["Cooking", "Lifestyle"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Photography Club",
  shortDesc: "Capture the moment.",
  longDesc: "We teach photography and videography with hands-on photo walks and editing tutorials.",
  image: "/images/photography.jpg",
  linkedin: "photo-club-vit",
  instagram: "vitphotography",
  email: "photo@vit.ac.in",
  teamStrength: 160,
  board: ["President: Samarth", "Vice-President: Pranati", "Secretary: Iqbal"],
  upcomingEvents: ["PhotoWalk: Campus Colors", "Lightroom Basics"],
  pastEvents: ["PhotoBattle", "Lens Stories Exhibition"],
  announcements: ["Best photo of July contest ends soon!", "Editing contest on 25th July"],
  tags: ["Photography", "Arts & Culture"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Drama Club",
  shortDesc: "Theatre for thinkers.",
  longDesc: "We perform thought-provoking plays, train in voice modulation, and organize drama nights.",
  image: "/images/drama.jpg",
  linkedin: "drama-club-vit",
  instagram: "vitdrama",
  email: "drama@vit.ac.in",
  teamStrength: 110,
  board: ["President: Rajvi", "Vice-President: Kunal", "Secretary: Tara"],
  upcomingEvents: ["Street Play Showcase", "Voice Acting Bootcamp"],
  pastEvents: ["Spotlight '25", "MonoAct Mania"],
  announcements: ["Casting call for street play!", "Voice training session on 20th July"],
  tags: ["Drama & Theatre", "Arts & Culture"],
  currentMembers: [],
  joinRequests: []
},
{
  name: "Quiz Club",
  shortDesc: "Trivia meets adrenaline.",
  longDesc: "We host quizzes from pop culture to politics, and train you to compete nationally.",
  image: "/images/quiz.jpg",
  linkedin: "quiz-club-vit",
  instagram: "vitquiz",
  email: "quiz@vit.ac.in",
  teamStrength: 140,
  board: ["President: Dheer", "Vice-President: Sneha", "Secretary: Tanush"],
  upcomingEvents: ["Pop Culture Quiz", "Tech Trivia Night"],
  pastEvents: ["Quizathon", "KBC Rewind"],
  announcements: ["New quiz format dropping!", "Team round rules released"],
  tags: ["Quizzing", "Fun & Lifestyle"],
  currentMembers: [],
  joinRequests: []
}


];

// 👤 USERS
const users = [
  {
    name: "Vedika Saboo",
    username: "vedika_saboo",
    email: "vedika@example.com",
    password: "test1234",
    role: "user",
    interests: ["AI", "Robotics", "Coding"],
    yourClubs: [{ name: "Design Club", role: "Core-Member" }],
    clubsApplied: [
      { name: "Cybersecurity Club", status: "pending" },
      { name: "Game Development Club", status: "rejected" }
    ],
    registeredEvents: [],
    completedEvents: [],
    yourClubEvents: [],
    eventsThisWeek: [],
    calendar: [],
    eventHistory: [],
    feedback: []
  },
  {
    name: "Krithi K",
    username: "admin_kriti",
    email: "admin@example.com",
    password: "bleh1234",
    role: "admin",
    yourClubs: [{ name: "The AI & ML Club", role: "Design Head" }],
    registeredEvents: [],
    completedEvents: [],
    yourClubEvents: [],
    eventsThisWeek: [],
    calendar: [],
    eventHistory: [],
    feedback: [],
    interests: []
  }
];

// 🌱 SEED FUNCTION
mongoose.connect(dbURI)
  .then(async () => {
    await Event.deleteMany({});
    await Club.deleteMany({});
    await User.deleteMany({});

    await Event.insertMany(events);
    await Club.insertMany(clubs);

    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    await User.insertMany(users);

    console.log("✅ Database seeded successfully!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.log("❌ Seeding error:", err);
  });
