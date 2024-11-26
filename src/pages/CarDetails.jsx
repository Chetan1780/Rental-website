import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../layout/Layout";
import { getCarById } from "../services/api"; // Assuming you have an API service for getting car details
import { FaStar } from "react-icons/fa"; // For rating display

const CarDetails = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch car details based on the car ID from the URL
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await getCarById(id);
        setCar(response.data); // Assuming response contains car details
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Loading car details...</p>
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Car not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            {/* Car Image */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src={car.image || "https://via.placeholder.com/500x300"} // Fallback image if no car image
                alt={car.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Car Details */}
            <div className="md:w-1/2 md:ml-10 text-center md:text-left">
              <h2 className="text-3xl font-semibold">{car.title}</h2>
              <p className="text-lg text-gray-600 mt-2">{car.description}</p>

              {/* Rating Section */}
              <div className="flex items-center mt-4">
                <FaStar className="text-yellow-500" />
                <span className="ml-2 text-lg font-semibold">{car.rating || "N/A"} / 5</span>
              </div>

              <p className="text-2xl font-bold mt-6">${car.price}</p>

              <div className="mt-8">
                <Link
                  to={`/booking/${car._id}`}
                  className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg"
                >
                  Book This Car
                </Link>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Car Specifications</h3>
            <ul className="list-disc pl-6">
              <li><strong>Make:</strong> {car.make}</li>
              <li><strong>Model:</strong> {car.model}</li>
              <li><strong>Year:</strong> {car.year}</li>
              <li><strong>Mileage:</strong> {car.mileage} miles</li>
              <li><strong>Fuel Type:</strong> {car.fuelType}</li>
              {/* Add more details as needed */}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CarDetails;
