// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const asyncHandler = require('express-async-handler'); // A simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.

// Helper to make async functions in controllers cleaner
// npm install express-async-handler
// Note: This is an optional package, you can also use try-catch blocks directly.
// For simplicity, let's just use try-catch for now, as asyncHandler adds another dependency.

// const protect = asyncHandler(async (req, res, next) => {
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request object (without password)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware for admin specific routes
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, authorizeAdmin };