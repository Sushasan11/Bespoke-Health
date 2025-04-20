import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaUser,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaNotesMedical,
  FaSignOutAlt,
} from "react-icons/fa";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../context/firebase";
import { toast } from "react-toastify";

function DoctorNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    "Update your KYC to access full features",
  ]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const message = payload.notification.body;
      toast(message);
      setNotifications((prev) => [...prev, message]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/doctor/dashboard" className="text-xl font-bold">
        Bespoke Health
      </Link>

      <div className="flex items-center space-x-6">
        <Link
          to="/doctor/appointments"
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <FaCalendarCheck />
          <span>Appointments</span>
        </Link>
        <Link
          to="/doctor/medical-data"
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <FaNotesMedical />
          <span>Medical Data</span>
        </Link>
        <Link
          to="/doctor/transactions"
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <FaMoneyBillWave />
          <span>Transactions</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <FaBell
            className="cursor-pointer"
            onClick={() => {
              setShowBellDropdown(!showBellDropdown);
              setShowUserDropdown(false);
            }}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          )}
          {showBellDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 shadow-md rounded-md p-3 z-10">
              {notifications.map((note, index) => (
                <div key={index} className="border-b py-2 text-sm">
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <FaUser
            className="cursor-pointer"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowBellDropdown(false);
            }}
          />
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-md rounded-md p-2 z-10">
              <Link
                to="/doctor/profile"
                className="block py-2 px-3 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/doctor/change-password"
                className="block py-2 px-3 hover:bg-gray-100"
              >
                Change Password
              </Link>
              <hr />
              <button className="block w-full text-left py-2 px-3 hover:bg-gray-100 text-red-600">
                <FaSignOutAlt className="inline-block mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DoctorNavbar;
