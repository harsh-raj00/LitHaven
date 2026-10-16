const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'LitHaven MERN Backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'LitHaven API',
    tagline: 'Next-Gen Campus Book Exchange & Study Vault',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      resources: '/api/resources',
      inquiries: '/api/inquiries',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lithaven';

// Connect to MongoDB and start Express server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[LitHaven] Connected to MongoDB successfully at ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`[LitHaven] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[LitHaven] API Base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error(`[LitHaven] Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
