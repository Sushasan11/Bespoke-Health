import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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
import { onMessage } from "firebase/messaging";
import { messaging } from "../../context/firebase";

export default function PatientNavbar() {
  const navigate = useNavigate();

  /* State declarations */
  const [departments, setDepartments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [navbarNotifications, setNavbarNotifications] = useState([]);
  const [kycPending, setKycPending] = useState(false);
  const deptDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  /* Fetch department list */
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  /* Fetch initial notifications */
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.get("/patient/navbar", {
          withCredentials: true,
        });
        setNavbarNotifications(response.data.notifications || []);
        if (
          response.data.notifications.some((notif) =>
            notif.includes("KYC is not verified")
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

  /* Handle foreground push notification from Firebase */
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const message = payload.notification.body;
      toast(message);
      setNavbarNotifications((prev) => [...prev, message]);

      if (message.includes("Your KYC is approved")) {
        setKycPending(false);
        setNavbarNotifications((prev) =>
          prev.filter((n) => !n.includes("KYC is not verified"))
        );
      }
    });

    return () => unsubscribe();
  }, []);

  /* Handle notification click actions */
  const handleNotificationClick = (notification) => {
    setShowDropdown(false);
    if (notification.includes("Your KYC is being verified")) {
      toast.info("Your KYC is already submitted and being verified.");
    } else if (notification.includes("KYC is not verified")) {
      navigate("/patient/kyc");
    } else if (notification.includes("appointment")) {
      navigate("/patient/appointments");
    }
  };

  /* Handle logout logic */
  const handleLogout = async () => {
    try {
      await api.post("/patient/logout", {}, { withCredentials: true });
      localStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      toast.success("Logged out successfully!");
      navigate("/patient/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  return (
    <>
      {/* KYC Warning Banner */}
      {kycPending && (
        <div className="bg-yellow-500 text-white text-center py-2">
          Your KYC is not verified.{" "}
          <button
            className="underline font-bold"
            onClick={() => navigate("/patient/kyc")}
          >
            Complete Now
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-[#1A1A1A] text-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/patient/dashboard")}
          >
            Bespoke Health
          </motion.div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Department Dropdown */}
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

            {/* Static Links */}
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
            <button
              onClick={() => navigate("/patient/profile")}
              className="flex items-center gap-2 hover:underline transition"
            >
              <FiUser /> Profile
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="relative flex items-center gap-2"
              >
                <FiBell className="text-xl" />
                {navbarNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                    {navbarNotifications.length}
                  </span>
                )}
              </button>
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
                    {navbarNotifications.map((notif, index) => (
                      <button
                        key={index}
                        onClick={() => handleNotificationClick(notif)}
                        className="p-2 border-b last:border-none text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                      >
                        {notif}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Logout Button */}
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
