const PricingService = {
    async calculateTotalPrice({ carId, startDate, endDate, insurance }) {
      // For simplicity, assume a flat price per day
      const car = await Car.findById(carId); // Retrieve car details
      if (!car) {
        throw new Error('Car not found');
      }
  
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
      const basePrice = car.pricePerDay; // Assume the car has a pricePerDay field
  
      // Calculate additional costs (insurance, etc.)
      const insuranceCost = insurance ? 20 : 0; // Example: $20 per day for insurance
  
      return days * basePrice + insuranceCost;
    }
  };
  
  module.exports = PricingService;
  