const CarService = require('../services/CarService');
const PricingService = require('../services/PricingService');
const PaymentService = require('../services/PaymentService');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

const BookingController = {
  async createBooking(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        carId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        insurance,
        additionalDrivers
      } = req.body;

      // Validate input
      if (!carId || !startDate || !endDate) {
        return res.status(400).json({ 
          message: 'Missing required booking parameters' 
        });
      }

      // Find the car and check its existence
      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      // Check car availability
      const isAvailable = await CarService.checkAvailability(carId, startDate, endDate);
      if (!isAvailable) {
        return res.status(400).json({ 
          message: 'Car is not available for selected dates' 
        });
      }

      // Calculate total price
      const totalPrice = await PricingService.calculateTotalPrice({
        carId,
        startDate,
        endDate,
        insurance
      });

      // Create payment intent (amount in cents)
      const paymentIntent = await PaymentService.createPaymentIntent(
        Math.round(totalPrice * 100), // Convert to cents
        {
          metadata: {
            carId,
            userId: req.user.id,
            bookingDates: JSON.stringify({ startDate, endDate })
          }
        }
      );

      // Create booking (not yet confirmed)
      const booking = new Booking({
        user: req.user.id,
        car: carId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        insurance,
        additionalDrivers,
        totalPrice,
        paymentDetails: {
          transactionId: paymentIntent.id,
          paymentMethod: 'stripe',
          paymentStatus: 'pending'
        },
        status: 'pending'
      });

      // Save booking in transaction
      await booking.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Respond with booking and client secret for Stripe
      res.status(201).json({
        booking: {
          _id: booking._id,
          totalPrice: booking.totalPrice,
          startDate: booking.startDate,
          endDate: booking.endDate
        },
        clientSecret: paymentIntent.client_secret
      });

    } catch (error) {
      // Rollback transaction
      await session.abortTransaction();
      session.endSession();

      console.error('Booking Creation Error:', error);
      res.status(500).json({ 
        message: 'Booking failed',
        error: error.message 
      });
    }
  },

  async confirmBooking(req, res) {
    const { bookingId, paymentMethodId } = req.body;

    try {
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Confirm payment intent
      const paymentIntent = await PaymentService.confirmPaymentIntent(
        booking.paymentDetails.transactionId,
        paymentMethodId
      );

      // Update booking status
      booking.paymentDetails.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      res.status(200).json({
        message: 'Booking confirmed',
        booking
      });

    } catch (error) {
      console.error('Booking Confirmation Error:', error);
      res.status(500).json({ 
        message: 'Booking confirmation failed',
        error: error.message 
      });
    }
  },

  async cancelBooking(req, res) {
    const { bookingId } = req.body;

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Refund if already paid
      if (booking.paymentDetails.paymentStatus === 'paid') {
        await PaymentService.refundPayment(
          booking.paymentDetails.transactionId
        );
      }

      // Update booking status
      booking.status = 'cancelled';
      booking.paymentDetails.paymentStatus = 'refunded';
      await booking.save();

      res.status(200).json({
        message: 'Booking cancelled',
        booking
      });

    } catch (error) {
      console.error('Booking Cancellation Error:', error);
      res.status(500).json({ 
        message: 'Booking cancellation failed',
        error: error.message 
      });
    }
  }
};

module.exports = BookingController;