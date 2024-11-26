import React from "react";
import { Link } from "react-router-dom";
import { FaDollarSign, FaCar, FaMapMarkerAlt } from "react-icons/fa"; // Example icons for price, car, and location

const CarCard = ({ car }) => {
  return (
    <div className="car-card bg-white shadow-lg rounded-lg overflow-hidden">
      <Link to={`/car/${car._id}`}>
        <img
          src={car.images?.[0] || "default-image.jpg"} // Use a default image if car image is missing
          alt={car.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{car.name}</h3>
          <div className="flex items-center mt-2 text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{car.location}</span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <FaCar className="mr-2" />
            <span>{car.category}</span> {/* You can display car category or type here */}
          </div>
          <div className="flex items-center mt-2 text-gray-800">
            <FaDollarSign className="mr-2" />
            <span className="text-lg font-bold">₹{car.pricePerDay}/day</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarCard;
