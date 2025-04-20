import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaLock,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import PatientNavbar from "../navbar/patientNavbar";
import api from "../../routes/axios";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../context/firebase"; // Firebase import

export default function PatientProfile() {
  /* State setup */
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "",
    phonenumber: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  /* Fetch user profile on mount */
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await api.get("/patient/me");
        setFormData(response.data);
      } catch {
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  /* Firebase notification handler */
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const message = payload.notification.body;
      showNotification(message, "info");
    });

    return () => unsubscribe();
  }, []);

  /* Show notification helper */
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  /* Handle form input changes */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  /* Handle profile update */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/patient/update-profile", formData);
      showNotification("Profile updated successfully!", "success");
    } catch {
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Handle password change */
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showNotification("Passwords don't match", "error");
      return;
    }
    setLoading(true);
    try {
      await api.put("/patient/change-password", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      showNotification("Password changed successfully!", "success");
      setShowPasswordModal(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch {
      showNotification("Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PatientNavbar />

      <div className="min-h-screen bg-gray-50 pt-25 py-8 px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white text-center">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="opacity-80">Manage your personal information</p>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {["name", "address", "phonenumber"].map((field, index) => (
                <div key={index} className="relative">
                  {field === "name" && (
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                  )}
                  {field === "address" && (
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  )}
                  {field === "phonenumber" && (
                    <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                  )}
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-xl"
                  />
                </div>
              ))}

              {/* Gender Selection */}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-3 px-4 border border-gray-300 rounded-xl"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* Button Group */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                {/* Save Changes Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>

                {/* Change Password Button */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              className={`fixed top-4 right-4 bg-${
                notification.type === "success" ? "green" : "red"
              }-500 text-white p-3 rounded`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-xl font-bold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {["old_password", "new_password", "confirm_password"].map(
                    (field, index) => (
                      <input
                        key={index}
                        type="password"
                        name={field}
                        placeholder={field.replace("_", " ").toUpperCase()}
                        value={passwordData[field]}
                        onChange={handlePasswordChange}
                        className="w-full py-3 px-4 border rounded-xl"
                        required
                      />
                    )
                  )}

                  {/* Update Password Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    <span>{loading ? "Updating..." : "Update Password"}</span>
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full mt-2 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
