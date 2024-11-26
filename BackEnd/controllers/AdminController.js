const User = require('../models/user'); // Ensure the User model is imported
const AdminController = {
  // Fetch dashboard data (example: user statistics, number of bookings, etc.)
  getDashboardData: async (req, res) => {
    try {
      // Example dashboard data
      const totalUsers = await User.countDocuments();
      // You can add more logic to fetch other dashboard stats (e.g., bookings, car listings, etc.)

      const dashboardData = {
        totalUsers,
        // Add more stats like total bookings, total cars, etc.
      };

      res.status(200).json({
        message: 'Dashboard data fetched successfully',
        dashboardData
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Fetch all users (example: used for admin management)
  getAllUsers: async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find(); // You can modify this to add pagination, filtering, etc.

      res.status(200).json({
        message: 'All users fetched successfully',
        users,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Fetch a specific user by ID (optional)
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id); // Assuming user ID is passed in the URL
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User data fetched successfully',
        user,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a user (optional admin function)
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id); // Assuming user ID is passed in the URL
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = AdminController;
