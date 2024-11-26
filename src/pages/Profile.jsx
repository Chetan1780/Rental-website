import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { useAuth } from "../hook/useAuth"; // Custom hook for authentication
import { getUserProfile, updateUserProfile } from "../services/api"; // API to get and update user data

const Profile = () => {
  const { user, setUser } = useAuth(); // Get current user from auth context (JWT token-based)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch the user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(user.token);
        setProfileData(response.data.user);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle input change for editing profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUserProfile(profileData, user.token);
      setUser(updatedUser); // Update the user context with the new data
      setEditing(false); // Disable editing after successful update
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-3xl font-semibold mb-6">Profile</h2>

          {error && (
            <div className="bg-red-500 text-white py-2 px-4 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleProfileUpdate}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
          >
            <div>
              <label htmlFor="name" className="block text-lg font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                disabled={!editing}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Admin Status</label>
              <p className="text-lg">{profileData.isAdmin ? "Yes" : "No"}</p>
            </div>

            <div className="flex justify-between items-center">
              {editing ? (
                <>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="text-gray-500 underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
