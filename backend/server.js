require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'https://fixr-eta.vercel.app', // Your actual Vercel URL
    'https://fixr-klkul3cce-sukhmans-projects-1d733bc6.vercel.app',
    'https://fixr.vercel.app',
    'http://localhost:3000',
    'http://localhost:8081',
    'exp://localhost:8081'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    mongodb_connected: mongoose.connection.readyState === 1
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database Connection
const PORT = process.env.PORT || 5012;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
