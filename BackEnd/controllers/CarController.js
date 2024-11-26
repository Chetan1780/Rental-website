// controllers/CarController.js
const Car = require('../models/Car');
const { NotFoundError, ValidationError } = require('../utils/errors');

const CarController = {
  // Get all cars with pagination and filters
  // async getCars(req, res, next) {
  //   try {
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 10;
  //     const skip = (page - 1) * limit;

  //     const filter = {};
  //     if (req.query.type) filter.type = req.query.type;
  //     if (req.query.transmission) filter.transmission = req.query.transmission;
  //     if (req.query.available !== undefined) filter.available = req.query.available === 'true';

  //     const cars = await Car.find(filter)
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ createdAt: -1 });

  //     const total = await Car.countDocuments(filter);

  //     res.json({
  //       cars,
  //       currentPage: page,
  //       totalPages: Math.ceil(total / limit),
  //       totalCars: total
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  async getAllCars(req, res){
    try {
      const { 
        search = '', 
        brand, 
        minPrice, 
        maxPrice, 
        transmission, 
        fuelType 
      } = req.query;
  
      // Build query object
      const query = {};
  
      // Search across multiple fields
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Additional filters
      if (brand) query.brand = brand;
      if (transmission) query.transmission = transmission;
      if (fuelType) query.fuelType = fuelType;
  
      // Price range filter
      if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) query.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
      }
  
      // Fetch cars with populated owner details
      const cars = await Car.find(query)
        .populate('owner', 'name email')
        .lean();
  
      res.status(200).json({ 
        total: cars.length, 
        cars 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching cars', 
        error: error.message 
      });
    }
  },
  
  async getCarDetails(req, res){
    try {
      const { id } = req.params;
      const car = await Car.findById(id)
        .populate('owner', 'name email')
        .lean();
  
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching car details', 
        error: error.message 
      });
    }
  },
  
  async bookCar(req, res){
    try {
      const { carId } = req.params;
      const { startDate, endDate } = req.body;
      const userId = req.user.id; // From authentication middleware
  
      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // Check for overlapping bookings
      const conflictBooking = car.bookings.find(booking => 
        (new Date(startDate) < new Date(booking.endDate)) && 
        (new Date(endDate) > new Date(booking.startDate))
      );
  
      if (conflictBooking) {
        return res.status(400).json({ 
          message: 'Car is already booked for the selected dates' 
        });
      }
  
      // Add new booking
      car.bookings.push({
        user: userId,
        startDate,
        endDate
      });
  
      await car.save();
  
      res.status(201).json({ 
        message: 'Car booked successfully', 
        booking: car.bookings[car.bookings.length - 1] 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Booking failed', 
        error: error.message 
      });
    }
  },

  // Search cars
  async searchCars(req, res, next) {
    try {
      const { query, location, startDate, endDate } = req.query;
      const searchFilter = {};

      if (query) {
        searchFilter.$or = [
          { make: { $regex: query, $options: 'i' } },
          { model: { $regex: query, $options: 'i' } }
        ];
      }

      const cars = await Car.find(searchFilter);
      res.json(cars);
    } catch (error) {
      next(error);
    }
  },

  // Get car by ID
  async getCarById(req, res, next) {
    try {

      const car = await Car.findById(req.params.id);
      console.log(car)
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      res.json(car);
    } catch (error) {
      next(error);
    }
  },

  // Create new ca

  
  async createCar(req, res){
    try {
      const {
        name, 
        brand, 
        model, 
        year, 
        transmission,
        fuelType,
        seatingCapacity,
        kilometersDriven,
        lotLatitude,
        lotLongitude,
        pricePerDay,
        images,
        features,
        description,
        owner
      } = req.body;
  
      // Validate location coordinates
      const latitude = parseFloat(lotLatitude);
      const longitude = parseFloat(lotLongitude);
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ 
          message: 'Invalid location coordinates' 
        });
      }
  
      // Create new car document
      const newCar = new Car({
        name,
        brand,
        model,
        year: Number(year),
        transmission,
        fuelType,
        seatingCapacity: Number(seatingCapacity),
        kilometersDriven: Number(kilometersDriven),
        lotLocation: {
          latitude,
          longitude
        },
        pricePerDay: Number(pricePerDay),
        images: images || [],
        features: features || [],
        description: description || '',
        owner
      });
  
      // Save the car
      const savedCar = await newCar.save();
  
      res.status(201).json({
        message: 'Car uploaded successfully',
        car: savedCar
      });
    } catch (error) {
      console.error('Car upload error:', error);
      res.status(500).json({ 
        message: 'Error uploading car',
        error: error.message 
      });
    }
  },

  // Update car
  async updateCar(req, res, next) {
    try {
      const car = await Car.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      res.json(car);
    } catch (error) {
      if (error.name === 'ValidationError') {
        next(new ValidationError('Invalid car data'));
      } else {
        next(error);
      }
    }
  },

  // Delete car
  async deleteCar(req, res, next) {
    try {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Add rating to car
  async addRating(req, res, next) {
    try {
      const { rating, review } = req.body;
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }

      car.ratings.push({
        user: req.user.id,
        rating,
        review
      });

      // Calculate new average rating
      car.averageRating = car.ratings.reduce((acc, curr) => acc + curr.rating, 0) / car.ratings.length;

      await car.save();
      res.json(car);
    } catch (error) {
      next(error);
    }
  },

  // Get nearby cars
  async getNearbyCars(req, res, next) {
    try {
      const { latitude, longitude } = req.params;
      const maxDistance = req.query.distance || 10000; // Default 10km radius

      const cars = await Car.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: maxDistance
          }
        }
      });

      res.json(cars);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = CarController;