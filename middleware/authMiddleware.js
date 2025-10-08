// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// CRITICAL: Load the secret directly from process.env, and use .trim()
// to remove any accidental trailing whitespace from the .env file.
const jwtSecret = process.env.JWT_SECRET.trim(); 

// Middleware to protect routes
const protect = (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const authParts = req.headers.authorization.split(' '); 

            // Check if the token string (index 1) exists
            if (authParts.length > 1) { 
                // Extract and clean up any potential whitespace
                token = authParts[1].trim(); 
            } else {
                token = null;
            }

            // 2. Verify the token
            if (token) {
                // Throws an error if signature is invalid or token is expired
                const decoded = jwt.verify(token, jwtSecret); 
                
                // Attach the user ID to the request object for use in contact routes
                req.userId = decoded.id; 

                // Proceed to the next middleware or route handler
                next();
            } else {
                throw new Error('Invalid token format.'); 
            }

        } catch (error) {
            // Handle specific JWT errors (malformed, signature, expired)
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ error: 'Not authorized, token invalid or expired.' });
        }
    } else {
        // Handle case where header is missing entirely
        return res.status(401).json({ error: 'Not authorized, no token.' });
    }
};

module.exports = { protect };