const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pickupLocation: {
    address: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    }
  },
  dropoffLocation: {
    address: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    }
  },
  totalPrice: { type: Number, required: true },
  insurance: {
    type: { type: String, enum: ['basic', 'premium', 'none'] },
    price: Number
  },
  additionalDrivers: [{
    name: String,
    licenseNumber: String,
    licenseExpiry: Date
  }],
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentMethod: String,
    paymentDate: Date
  }
}, { timestamps: true });
