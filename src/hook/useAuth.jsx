import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  // Check if the JWT token exists and validate it
  const validateToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Set the JWT token in axios headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch the user data
      const response = await axios.get("/api/users/profile");
      setUser(response.data.user);
    } catch (err) {
      console.log("Token validation failed:", err.message);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    // navigate("/login");  // Navigate to login page after logout
  };

  return {
    user,
    setUser,
    logout,
  };
};
