// routes/cars.js
const express = require('express');
const router = express.Router();
const contact = require('../controllers/contactController');

// Define routes with proper middleware and controller methods
// router.get('/', contact.getCars);
router.post('/',contact.createFeedback)
router.get('/',contact.getFeedback)

module.exports = router;