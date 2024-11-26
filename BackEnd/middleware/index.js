const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you have a User model to fetch user details

// Authentication Middleware: Verify JWT token and attach user to request
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming `User` model has a `findById` method to retrieve user details
    // const user = await User.findById(decoded._id);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found hola' });
    }

    req.user = user;  // Attach user to the request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Admin Middleware: Ensure the user is an admin
const admin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Admin authentication failed' });
  }
};

module.exports = {
  auth,
  admin,
};
