const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows client requests from React frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Health check / welcome route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '💼 Job & Internship Application Tracker API is running smoothly',
    version: '1.0.0',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      jobs: [
        'GET /api/jobs',
        'POST /api/jobs',
        'GET /api/jobs/stats',
        'POST /api/jobs/seed',
        'GET /api/jobs/:id',
        'PUT /api/jobs/:id',
        'DELETE /api/jobs/:id'
      ]
    }
  });
});

// Custom 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
  console.log(`🌐 API ready at http://localhost:${PORT}`);
});

module.exports = app;
