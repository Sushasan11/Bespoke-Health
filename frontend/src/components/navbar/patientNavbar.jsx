import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiHeart,
  FiUsers,
  FiDatabase,
} from "react-icons/fi";
import { getDepartments } from "../../routes/departmentRoutes";
import api from "../../routes/axios";

export default function PatientNavbar() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [kycPending, setKycPending] = useState(false);
  const deptDropdownRef = useRef(null);

  // Fetch notifications & KYC status
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.get("/patient/navbar", {
          withCredentials: true,
        });
        setNotifications(response.data.notifications || []);

        // If KYC is not verified, add a persistent notification
        if (
          response.data.notifications.includes(
            "⚠️ Your KYC is not verified. Please complete it."
          )
        ) {
          setKycPending(true);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    fetchNotifications();
  }, []);

  // Fetch department data
  useEffect(() => {
    async function fetchData() {
      try {
        const departmentData = await getDepartments();
        setDepartments(departmentData);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    }
    fetchData();
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await api.post("/patient/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("token");
    document.cookie =
      "session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setShowLogoutModal(false);
    navigate("/patient/login");
  };

  return (
    <>
      {/* KYC Pending Banner */}
      {kycPending && (
        <div className="bg-yellow-500 text-white text-center py-2">
          ⚠️ Your KYC is not verified.{" "}
          <button
            className="underline font-bold"
            onClick={() => navigate("/profile")}
          >
            Complete Now
          </button>
        </div>
      )}

      <nav className="bg-[#1A1A1A] text-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <motion.div
            className="text-2xl font-bold cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/patient/dashboard")}
          >
            Bespoke Health
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={deptDropdownRef}>
              <button
                onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                className="flex items-center gap-2 hover:underline transition"
              >
                <FiDatabase /> Departments
              </button>
              <AnimatePresence>
                {showDeptDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md p-2"
                  >
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() =>
                          navigate(`/departments/${dept.id}/doctors`)
                        }
                      >
                        {dept.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate("/doctors")}
              className="flex items-center gap-2 hover:underline transition"
            >
              <FiUsers /> Doctors
            </button>

            <button
              onClick={() => navigate("/ai-prediction")}
              className="flex items-center gap-2 hover:underline transition"
            >
              <FiHeart /> AI Prediction
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative flex items-center gap-2"
              >
                <FiBell className="text-xl" />
                {(notifications.length > 0 || kycPending) && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                    {notifications.length + (kycPending ? 1 : 0)}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-md p-3"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Notifications
                    </h3>
                    <div className="max-h-60 overflow-y-auto">
                      {kycPending && (
                        <div className="p-2 border-b last:border-none text-sm text-red-600 font-semibold">
                          ⚠️ Your KYC is not verified.{" "}
                          <button
                            className="underline font-bold text-blue-600"
                            onClick={() => navigate("/profile")}
                          >
                            Complete Now
                          </button>
                        </div>
                      )}
                      {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                          <div
                            key={index}
                            className="p-2 border-b last:border-none text-sm text-gray-700"
                          >
                            {notif}
                          </div>
                        ))
                      ) : (
                        <p className="p-2 text-sm text-gray-600">
                          No new notifications
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
            <motion.div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-800">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to log out?
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={handleLogout}
                >
                  ✓
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowLogoutModal(false)}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
