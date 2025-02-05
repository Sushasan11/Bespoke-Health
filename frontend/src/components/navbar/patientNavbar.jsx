import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import {
  BsPersonCircle,
  BsBoxArrowRight,
  BsBellFill,
  BsExclamationCircle,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import { FaHospital, FaUserMd, FaStethoscope } from "react-icons/fa";
import "../../styles/navbarCss.css";
import logo from "../../assests/logo.jpeg";

function PatientNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [patientName, setPatientName] = useState("Patient");
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch user profile and check if KYC is updated
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get("/me/");
        setPatientName(response.data.name || "Patient");

        // Check for KYC notification
        const kycMessage = localStorage.getItem("kyc_notification");

        // Remove notification if KYC is completed
        if (response.data.name && kycMessage) {
          localStorage.removeItem("kyc_notification");
          setNotifications([]);
        } else if (!response.data.name && kycMessage) {
          setNotifications([kycMessage]);
        }
      } catch (error) {
        console.error("Failed to fetch patient data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchPatientData();
  }, [navigate]);

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setNotificationOpen((prev) => !prev);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setNotificationOpen(false);
        setShowLogoutModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>

        {/* Left Side Navigation */}
        <div className="nav-links">
          <Link to="/get-department" className="nav-item">
            <FaHospital className="nav-icon" /> Get Department
          </Link>
          <Link to="/get-doctor" className="nav-item">
            <FaUserMd className="nav-icon" /> Get Doctor
          </Link>
          <Link to="/predict-disease" className="nav-item">
            <FaStethoscope className="nav-icon" /> Predict Disease
          </Link>
        </div>

        {/* Right Side - Notifications, Profile, Logout */}
        <div className="right-section">
          <div className="notification-profile-container">
            {/* Notifications Icon with Badge */}
            <div
              ref={notificationRef}
              className="notification-container"
              onClick={toggleNotifications}
            >
              <BsBellFill className="notification-icon" />
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
              {notificationOpen && (
                <div className="notification-dropdown">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <div
                        key={index}
                        className="notification-item"
                        onClick={() => {
                          if (
                            notif ===
                            "Please verify your KYC to access all features."
                          ) {
                            navigate("/update-profile");
                            setNotifications([]);
                          }
                        }}
                      >
                        {notif}
                      </div>
                    ))
                  ) : (
                    <div className="notification-item">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              ref={dropdownRef}
              className="profile-container"
              onClick={toggleDropdown}
            >
              <BsPersonCircle className="profile-icon" /> {patientName} ▼
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/update-profile" className="dropdown-item">
                    Update Profile
                  </Link>
                  <Link to="/change-password" className="dropdown-item">
                    Change Password
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">
            <BsBoxArrowRight className="logout-icon" /> Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal" ref={modalRef}>
            <div className="modal-header">
              <BsExclamationCircle className="modal-icon warning" />
              <h2>Confirm Logout</h2>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to log out?</p>
            </div>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                <BsXCircle className="button-icon" />
                Cancel
              </button>
              <button className="modal-button confirm" onClick={confirmLogout}>
                <BsCheckCircle className="button-icon" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientNavbar;
