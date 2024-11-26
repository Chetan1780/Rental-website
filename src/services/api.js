import axios from 'axios';

// Base URL configuration
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cars API
export const getCars = () => API.get('/cars');
export const searchCars = (query) => API.get(`/cars/search`, { params: query });
export const getCarById = (id) => API.get(`/cars/${id}`);
export const createCar = (data) => API.post('/cars', data);
export const updateCar = (id, data) => API.put(`/cars/${id}`, data);
export const deleteCar = (id) => API.delete(`/cars/${id}`);
export const addCarRating = (id, rating) => API.post(`/cars/${id}/ratings`, { rating });
export const getNearbyCars = (latitude, longitude) =>
  API.get(`/cars/nearby/${latitude}/${longitude}`);

// Bookings API
export const createBooking = (data) => API.post('/bookings', data);
// Add more booking methods if needed

// Users API
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getUserProfile = () => API.get('/users/profile');

export const updateUserProfile = (data, token) =>
  API.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
// Admin API
export const getDashboardData = () => API.get('/admin/dashboard');
export const getAllUsers = () => API.get('/admin/users');

// Export as default
export default API;
