const express = require('express');
const router = express.Router();
const PaymentController = require('../services/PaymentService');  // Adjust path as needed

// Define the endpoint for creating a payment intent
router.post('/create-payment-intent', PaymentController.createPaymentIntent);

module.exports = router;
