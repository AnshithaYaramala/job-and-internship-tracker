# 💼 Jobtrakr — Job & Internship Application Tracker

> A full-stack, production-grade web application to track, manage, and analyze job and internship applications across recruitment stages. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and secured with **JWT authentication**.

---

## 📸 Key Features

- **🔐 User Authentication**: Secure registration and login using JWT (JSON Web Tokens) with salted bcrypt password hashing.
- **📑 Full CRUD Applications**: Add, view, edit, and delete job and internship applications.
- **🎨 Visual Status Tracking**: Color-coded pastel status cards matching application stages:
  - 🟡 **Applied** (Soft Yellow)
  - 🔵 **Interview** (Soft Indigo/Blue)
  - 🟢 **Selected / Offer** (Soft Emerald Green)
  - 🔴 **Rejected** (Soft Rose/Pink)
- **🔍 Real-Time Search & Filtering**: Live search by company name, role, or location, and one-click status filter pills (`All`, `Applied`, `Interview`, `Selected`, `Rejected`).
- **📊 Application Analytics Dashboard**: Live metrics for Total Applications, Active Interviews, Offers Received, and Rejection rates.
- **✨ Instant Demo Data**: One-click "Load Sample Data" button to test the UI with realistic tech industry job applications.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) & Bcrypt.js |
| **API Architecture** | RESTful JSON API with Axios Interceptors |

---

## 📁 Project Structure

```
Job & Internship tracker/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me endpoints
│   │   └── jobController.js    # Job CRUD, Filters, Stats, Seed
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # User Schema with bcrypt hooks
│   │   └── Job.js              # Job Schema with user ownership
│   ├── routes/
│   │   ├── authRoutes.js       # Auth routing
│   │   └── jobRoutes.js        # Protected Job routes
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobCard.jsx     # Pastel application card
│   │   │   └── JobModal.jsx    # Add/Edit application modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state & JWT persistence
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Metrics, filters, card grid
│   │   │   ├── Login.jsx       # Login screen + Demo account
│   │   │   └── Register.jsx    # User registration screen
│   │   ├── services/
│   │   │   └── api.js          # Axios client with auto Bearer tokens
│   │   ├── App.jsx             # Main router & auth switch
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Tailwind directives
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/jobtracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Server will run at `http://localhost:5000`*

---

### 3. Frontend Setup
1. In a second terminal window, navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173` or `http://localhost:3000`) in your web browser.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Authenticate and receive a JWT token
- `GET /api/auth/me` — Fetch currently authenticated user profile

### Job Applications *(Requires `Authorization: Bearer <token>`)*
- `GET /api/jobs` — Retrieve all jobs (Query params: `search`, `status`, `jobType`)
- `POST /api/jobs` — Create a new job application
- `GET /api/jobs/stats` — Retrieve aggregated pipeline statistics
- `POST /api/jobs/seed` — Seed sample job applications
- `GET /api/jobs/:id` — Get details of a single job
- `PUT /api/jobs/:id` — Update job application status or details
- `DELETE /api/jobs/:id` — Delete a job application

---

## 📜 License
MIT License. Created for learning, portfolio demonstration, and career preparation.
