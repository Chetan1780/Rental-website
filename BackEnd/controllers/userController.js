const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Replace with your actual User model

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

const UserController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, isAdmin = false } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user with optional isAdmin parameter
      const user = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin, // Set the provided isAdmin value or default to false
      });
      await user.save();

      // Generate a JWT token
      const token = generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin, // Include isAdmin in the response
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Invalid email or password' });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = generateToken(user);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin, // Include isAdmin in the response
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      // Assume `req.user` is populated by middleware
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController;
