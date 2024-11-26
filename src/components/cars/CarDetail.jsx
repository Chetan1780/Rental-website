import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaDollarSign, FaCar, FaMapMarkerAlt, FaStar } from "react-icons/fa"; // Icons for price, car, location, and rating

const CarDetails = () => {
  const { id } = useParams(); // Get car ID from URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch car details based on the car ID
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching car details", err);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="car-details container mx-auto p-4">
      <div className="flex flex-col lg:flex-row">
        <div className="car-image w-full lg:w-1/2 mb-4 lg:mb-0">
          <img
            src={car.image || "default-image.jpg"} // Display default image if car image is missing
            alt={car.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="car-info w-full lg:w-1/2 lg:pl-8">
          <h2 className="text-3xl font-bold text-gray-800">{car.name}</h2>
          <div className="flex items-center mt-2 text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{car.location}</span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <FaCar className="mr-2" />
            <span>{car.category}</span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <FaStar className="mr-2 text-yellow-500" />
            <span>{car.rating} / 5 ({car.reviews.length} reviews)</span>
          </div>
          <div className="mt-4 text-gray-800">
            <h3 className="text-xl font-semibold">Price</h3>
            <div className="flex items-center text-lg font-bold">
              <FaDollarSign className="mr-2" />
              <span>{car.price} / day</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-gray-700">{car.description}</p>
          </div>
          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
