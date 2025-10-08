// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// CRITICAL: Load and trim the secret key for use in signing
const jwtSecret = process.env.JWT_SECRET.trim(); 

// Helper function to generate JWT
const generateToken = (userId) => {
    // Uses the same jwtSecret for signing
    return jwt.sign({ id: userId }, jwtSecret, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

// -------------------------------------------------------------
// 1. POST /api/auth/register (Registration)
// -------------------------------------------------------------
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        // 1. Check if the user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rowCount > 0) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        // 2. HASH the password (Security Step!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert the new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [email, hashedPassword, first_name, last_name]
        );

        const userId = newUser.rows[0].id;
        
        // 4. Generate a JWT token 
        const token = generateToken(userId);

        // 5. Respond with the token
        res.status(201).json({
            message: 'Registration successful!',
            token: token,
            jwt_secret_used: jwtSecret, 
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// -------------------------------------------------------------
// 2. POST /api/auth/login (Login)
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials (User not found).' });
        }

        // 2. COMPARE the provided password with the stored HASH
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials (Incorrect password).' });
        }

        // 3. Credentials are valid! Generate a new token
        const token = generateToken(user.id);

        // 4. Respond with the token
        res.status(200).json({
            message: 'Login successful!',
            token: token,
            userId: user.id
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

module.exports = router;