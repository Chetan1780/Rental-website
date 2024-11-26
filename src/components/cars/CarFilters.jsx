import React, { useState } from "react";

const CarFilters = ({ onFilter }) => {
  const [brand, setBrand] = useState(""); // For filtering by brand
  const [maxPrice, setMaxPrice] = useState(""); // For filtering by max price

  const handleApplyFilters = () => {
    onFilter({ brand, maxPrice: maxPrice ? Number(maxPrice) : null });
  };

  const handleResetFilters = () => {
    setBrand("");
    setMaxPrice("");
    onFilter({});
  };

  return (
    <div className="car-filters p-4 bg-gray-100 rounded-lg">
      <div className="mb-4">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
          Brand
        </label>
        <input
          id="brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter car brand"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
          Max Price (INR)
        </label>
        <input
          id="maxPrice"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Enter max price"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CarFilters;
