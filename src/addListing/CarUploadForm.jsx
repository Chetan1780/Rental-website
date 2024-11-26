import React, { useState } from 'react';
import Compressor from 'compressorjs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../services/firebaseConfig';

const CarUploadForm = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seatingCapacity: '',
    kilometersDriven: '',
    lotLatitude: '',
    lotLongitude: '',
    pricePerDay: '',
    images: [], // Will store Firebase image URLs
    features: '',
    description: '',
    useGeolocation: false, // Track whether to use geolocation or not
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            const storageRef = ref(storage, `car-images/${Date.now()}_${file.name}`);
            uploadBytes(storageRef, result)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => resolve(url))
              .catch(reject);
          },
          error(err) {
            reject(err);
          }
        });
      });
    });

    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      
      // Update image previews
      setImagePreviews(prev => [...prev, ...uploadedUrls]);
      setIsUploading(false);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Validate image upload
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    // Validate year input
    if (formData.year > currentYear) {
      setError('Year cannot be more than the current year');
      return;
    }

    const payload = {
      ...formData,
      lotLocation: {
        latitude: formData.lotLatitude,
        longitude: formData.lotLongitude,
      },
      features: formData.features 
        ? formData.features.split(',').map((feature) => feature.trim())
        : [],
    };
  
    const token = localStorage.getItem('token');
    const owner = getOwnerFromToken();
  
    if (!owner) {
      setError('Owner not found. Please log in.');
      return;
    }
  
    payload.owner = owner;
  
    try {
      const response = await fetch('http://localhost:3000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload car data');
        return;
      }
  
      setSuccess('Car data uploaded successfully!');
      // Reset form
      setFormData({
        name: '', brand: '', model: '', year: '', transmission: 'Manual',
        fuelType: 'Petrol', seatingCapacity: '', kilometersDriven: '',
        lotLatitude: '', lotLongitude: '', pricePerDay: '',
        images: [], features: '', description: '',
        useGeolocation: false, // Reset geolocation choice
      });
      setImagePreviews([]);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const getOwnerFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            lotLatitude: latitude,
            lotLongitude: longitude,
            useGeolocation: true,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location. Please check your permissions.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const removeImage = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));
    setImagePreviews((prev) => prev.filter(url => url !== urlToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-4">Upload Car Details</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Car Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <input
          type="number"
          name="seatingCapacity"
          placeholder="Seating Capacity"
          value={formData.seatingCapacity}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="kilometersDriven"
          placeholder="Kilometers Driven"
          value={formData.kilometersDriven}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        
        {/* Latitude and Longitude */}
        <div>
          <button
            type="button"
            onClick={handleGeolocation}
            className="bg-green-500 text-white py-2 px-6 rounded mb-4"
          >
            Use My Current Location
          </button>
          <div>
            <label>
              Latitude: 
              <input
                type="text"
                name="lotLatitude"
                value={formData.lotLatitude}
                onChange={handleChange}
                disabled={formData.useGeolocation}
                className="w-full p-2 border rounded"
              />
            </label>
            <label>
              Longitude: 
              <input
                type="text"
                name="lotLongitude"
                value={formData.lotLongitude}
                onChange={handleChange}
                disabled={formData.useGeolocation}
                className="w-full p-2 border rounded"
              />
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
        
        <div className="space-y-2">
          {imagePreviews.length > 0 && imagePreviews.map((url, index) => (
            <div key={index} className="flex justify-between items-center">
              <img src={url} alt={`Image ${index}`} className="w-20 h-20 object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="features"
          placeholder="Features (comma separated)"
          value={formData.features}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CarUploadForm;
