// backend/server.js

// 1. Load environmental variables from .env file
require('dotenv').config();
// server.js (Just after dotenv.config())
console.log("DEBUG: Loaded JWT Secret (Length):", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'NOT FOUND'); 
console.log("DEBUG: Loaded JWT Secret:", process.env.JWT_SECRET);
// You should see the full key printed here.
// Verify the length matches your expected key length (e.g., 128 characters for a 64-byte hex key)
// You can compare this string to the one in your .env file

// 2. Import Packages & Local Modules
const express = require('express');
const cors = require('cors');

// Import routes and middleware
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { protect } = require('./middleware/authMiddleware'); // Moved this up for organization

// Optional: Import pool for connection check (assuming db.js exports the pool)
// const pool = require('./db'); 

// 3. Initialize the Express app
const app = express();

// 4. Middleware Setup
app.use(cors()); // Enables cross-origin requests
app.use(express.json()); // Allows the server to read JSON bodies

// 5. Mount Routes (Traffic Control)

// A. Unprotected Routes (Authentication)
app.use('/api/auth', authRoutes);

// B. Protected Routes (Contact Management)
// CRITICAL FIX: Only mount the route ONCE, with the protect middleware FIRST.
app.use('/api/contacts', protect, contactRoutes); 

// 6. Basic Test Route
app.get('/', (req, res) => {
    res.send('Contact Management System Backend is running');
});

// 7. Set the port and Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});