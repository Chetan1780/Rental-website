const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { auth } = require('../middleware');

// Routes for user operations
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/profile', auth, UserController.getUserProfile);
// Add more routes as needed

module.exports = router;
