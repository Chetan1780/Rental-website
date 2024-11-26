const mongoose = require('mongoose');
const Car = require('../models/Car'); // Replace with your actual Car model

const CarService = {
  async checkAvailability(carId, startDate, endDate) {
    try {
      // Convert carId to ObjectId
      const objectId = new mongoose.Types.ObjectId(carId);

      const car = await Car.findOne({
        _id: objectId,
        bookings: {
          $elemMatch: {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
        },
      });

      return !car; // Return true if no conflicting bookings are found
    } catch (error) {
      throw new Error('Invalid car ID');
    }
  },
};

module.exports = CarService;
