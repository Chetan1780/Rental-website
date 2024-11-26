import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { useAuth } from "../hook/useAuth";
import { getDashboardData, getAllUsers } from "../services/api"; // API services

const Admin = () => {
  const { user } = useAuth(); // Get current user from auth context (JWT token-based)
  const [dashboardData, setDashboardData] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard and users data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(user.token);
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data");
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers(user.token);
        setUsers(response.data.users);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    if (user) {
      fetchDashboardData();
      fetchAllUsers();
    }
  }, [user]);

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    // try {
    //   await deleteUser(userId, user.token);
    //   setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Remove deleted user from the list
    // } catch (err) {
    //   setError("Failed to delete user");
    // }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>

          {error && (
            <div className="bg-red-500 text-white py-2 px-4 rounded mb-4">
              {error}
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium">Total Users</h3>
              <p className="text-2xl font-bold">{dashboardData.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium">Active Cars</h3>
              <p className="text-2xl font-bold">{dashboardData.activeCars || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium">Total Bookings</h3>
              <p className="text-2xl font-bold">{dashboardData.totalBookings || 0}</p>
            </div>
          </div>

          {/* Users Table */}
          <h3 className="text-2xl font-semibold mb-4">Users List</h3>
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.isAdmin ? "Admin" : "User"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white py-1 px-3 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
