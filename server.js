require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import database connection

const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (important for Render)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Contact Manager API is running!');
});



// Your API routes
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected!', 
      time: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import and use your routes
// const userRoutes = require('./routes/users');
// app.use('/api/users', userRoutes);
const authRoutes = require('./routes/authRoutes'); 
const contactRoutes = require('./routes/contactRoutes');

app.use('/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
});

// Use Render's PORT environment variable
const PORT = process.env.PORT || 5000;
const HOST='0.0.0.0';

app.listen(PORT,HOST, () => {
  console.log(`Server running on port ${PORT}on host 0.0.0.0`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  pool.query('SELECT 1').then(() => console.log('Database connection verified after startup.')).catch(e => console.error('Initial DB check failed:', e.message));
});