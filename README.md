# 🌿 EcoPulse

**EcoPulse** is a modern environmental reporting platform that bridges the gap between citizens and local authorities. It empowers residents to report eco issues like pollution, deforestation, and illegal dumping — track resolutions in real-time, and measure collective environmental impact.

🔗 **Live Demo:** https://eco-pulse-git-main-vaishal-dsouzas-projects.vercel.app/

---

## ✨ Features

- **🔐 User Authentication** — Secure Sign Up and Login for both **Citizens** and **Admins** using Bcrypt password hashing
- **🗺️ Interactive Map Reporting** — Search any location or click directly on a Leaflet map to pin and report an eco issue
- **🌊 Environmental Issue Categories** — Water pollution, air pollution, deforestation, illegal dumping, industrial effluents, and more
- **📊 Eco Impact Dashboard** — Track trees saved, kg of waste removed, water bodies protected, and CO₂ equivalents prevented
- **🔴 Severity Badges** — Every issue is tagged Low → Moderate → High → Critical with color-coded badges
- **🌱 Eco Warriors Leaderboard** — Gamified ranking with badges from Seedling 🌱 to Guardian 🌳 based on points earned
- **💬 Direct Messaging** — Built-in communication between citizens and admins on specific issue reports

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI framework |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Leaflet / React-Leaflet | Interactive maps |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js & Express.js | REST API server |
| MongoDB & Mongoose | Database |
| Bcrypt.js | Password hashing |
| CORS & Dotenv | Security & config |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (free) or local MongoDB

### 1. Clone the repository
```bash
git clone https://github.com/vaishaldsouza/EcoPulse.git
cd EcoPulse
```

### 2. Set up the Backend
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### 3. Set up the Frontend

Open a new terminal from the root directory:
```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure
```
EcoPulse/
├── public/
│   └── assets/              # Static images
├── src/
│   ├── components/
│   │   ├── auth/            # Login, Signup modals
│   │   ├── dashboard/       # ReportIssueTab, Leaderboard, IssueFeed
│   │   ├── issue/           # IssueCard with severity badge
│   │   └── Layout/          # Navbar, Footer
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ThemeContext.jsx # Dark/light mode state
│   ├── data/
│   │   └── mockIssues.js    # Sample environmental issues (Mysuru)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashBoard.jsx
│   │   └── Impact.jsx       # Eco metrics dashboard
│   └── App.jsx              # Route configuration
├── server/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Issue.js         # Issue schema with severity & eco impact
│   ├── routes/
│   │   ├── authRoutes.js    # Register, Login, Leaderboard
│   │   └── issueRoutes.js   # Create, Fetch, Upvote, Message
│   └── index.js             # Express entry point
├── vercel.json              # Vercel rewrite rules
└── package.json
```

---

## 🌍 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `FRONTEND_URL` | Your Vercel frontend URL (for CORS) |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **Citizen** | Report issues, upvote, comment, view dashboard |
| **Admin** | All citizen permissions + update issue status, manage all reports |

---

## 🏆 Eco Warriors Badge System

| Badge | Points Required |
|---|---|
| 🌱 Seedling | 0+ points |
| 🌿 Sprout | 10+ points |
| 🌲 Sapling | 25+ points |
| 🌳 Guardian | 50+ points |

Points are awarded automatically — **10 points** for every issue reported.

---

## 📄 License

MIT License — feel free to use this project for learning or building on top of it.

---

*Built with 💚 for environmental action — Hackathon Project 2026*
