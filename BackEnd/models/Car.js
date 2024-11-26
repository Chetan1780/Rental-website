const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  kilometersDriven: {
    type: Number,
    required: true,
  },
  lotLocation: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String, // URLs to the car images
    },
  ],
  features: [
    {
      type: String, // Additional features such as "Air Conditioning", "GPS", etc.
    },
  ],
  available: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Reference to the owner of the car
  },
  bookings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    maxlength: 500, // Optional: description about the car
  },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
