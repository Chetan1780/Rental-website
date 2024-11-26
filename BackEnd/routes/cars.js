// routes/cars.js
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware');

const CarController = require('../controllers/CarController');

// Define routes with proper middleware and controller methods
// router.get('/', CarController.getCars);
router.get('/',CarController.getAllCars)
router.get('/search', CarController.searchCars);
router.get('/:id', CarController.getCarById);
router.post('/', [auth, admin], CarController.createCar);
router.put('/:id', [auth, admin], CarController.updateCar);
router.delete('/:id', [auth, admin], CarController.deleteCar);
router.post('/:id/ratings', auth, CarController.addRating);
router.get('/nearby/:latitude/:longitude', CarController.getNearbyCars);

module.exports = router;