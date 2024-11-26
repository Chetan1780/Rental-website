import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      console.log('Query Parameters:', queryParams);
      const response = await fetch(`http://localhost:3000/api/cars?${queryParams}`);
      const data = await response.json();
      setCars(data.cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCarSelect = (carId) => {
    console.log(carId)
    navigate(`/cars/${carId}`);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Filters */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search cars"
          value={filters.search}
          onChange={handleFilterChange}
          className="border p-2"
        />
        <select 
          name="brand" 
          value={filters.brand}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">All Brands</option>
          <option value="Lamborghini">Lamborghini</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="Chevrolet">Chevrolet</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Kia">Kia</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="Audi">Audi</option>
          <option value="Porsche">Porsche</option>
          <option value="Tesla">Tesla</option>
          <option value="Nissan">Nissan</option>
          <option value="Jaguar">Jaguar</option>
          <option value="Ferrari">Ferrari</option>
          <option value="Bentley">Bentley</option>
          <option value="Volvo">Volvo</option>
          <option value="Land Rover">Land Rover</option>
          <option value="Mazda">Mazda</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Jeep">Jeep</option>
        </select>
        <select 
          name="transmission" 
          value={filters.transmission}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">All Transmissions</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price (₹)"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="border p-2"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price (₹)"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border p-2"
        />
      </div>

      {/* Car List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div 
              key={car._id} 
              className="border bg-slate-200 rounded-lg p-4 cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1"
              onClick={() => handleCarSelect(car._id)}
            >
              <img 
                src={car.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={car.name || 'Car'} 
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl px-2 font-bold mt-2">{car.name || 'Unnamed Car'}</h2>
              <div className='flex justify-between px-2'>
                <p className="text-green-600 font-semibold">₹{car.pricePerDay}/day</p>
                <p className="text-blue-700 ">Model: {car.model}</p>

              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No cars found</p>
        )}
      </div>
    </div>
  );
};

export default CarList;
