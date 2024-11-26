import React, { useState, useEffect } from "react";
import axios from "axios";
import CarCard from "./CarCard";
import CarFilter from "./CarFilters";

const CarList = () => {
  const [cars, setCars] = useState([]); // To store fetched cars
  const [filteredCars, setFilteredCars] = useState([]); // To store cars after applying filters
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch all cars from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5173/api/cars");
        const carsData = Array.isArray(response.data) ? response.data : [];
        setCars(carsData); // Store all cars
        setFilteredCars(carsData); // Initially, filteredCars = all cars
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCars([]);
        setFilteredCars([]);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply filters when the user selects a filter
  const handleFilteredCars = (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredCars(cars); // If no filters, reset to all cars
    } else {
      const filtered = cars.filter((car) => {
        // Example filter logic (adjust according to your filters)
        const matchesBrand = !filters.brand || car.brand === filters.brand;
        const matchesPrice =
          !filters.maxPrice || car.pricePerDay <= filters.maxPrice;

        return matchesBrand && matchesPrice;
      });
      setFilteredCars(filtered);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <span>Loading cars...</span>
      </div>
    );
  }

  return (
    <div className="car-list">
      <div className="filters mb-6">
        <CarFilter onFilter={handleFilteredCars} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => <CarCard key={car._id} car={car} />)
        ) : (
          <div className="col-span-4 text-center text-xl text-gray-600">
            No cars found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
