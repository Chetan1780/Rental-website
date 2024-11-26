const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { auth, admin } = require('../middleware');

// Routes for admin operations
router.get('/dashboard', [auth, admin], AdminController.getDashboardData);
router.get('/users', [auth, admin], AdminController.getAllUsers);
// Add more admin-specific routes as needed

module.exports = router;
