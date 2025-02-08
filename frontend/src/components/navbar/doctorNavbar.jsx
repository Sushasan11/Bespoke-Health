import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaKey,
  FaExclamationCircle,
  FaUserInjured,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";
import axios from "../../routes/axios";
import "../../styles/navbarCss.css";

const DoctorNavbar = () => {
  const [doctorName, setDoctorName] = useState("Doctor");
  const [kycStatus, setKycStatus] = useState("pending");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("/doctor/me/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDoctorName(response.data.name || "Doctor");
        setKycStatus(response.data.kyc_status);
      } catch (error) {
        console.error("Failed to fetch doctor data");
        localStorage.removeItem("token");
        navigate("/login/doctor");
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/doctor/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        let updatedNotifications = response.data;

        if (kycStatus !== "approved") {
          updatedNotifications = [
            {
              id: "kyc-warning",
              message: "🚨 Please verify your KYC to access full features.",
              link: "/doctor/update-profile",
              read: false,
            },
            ...response.data,
          ];
        }

        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchDoctorData();
    fetchNotifications();
  }, [navigate, kycStatus]);

  const handleNotificationClick = (link) => {
    if (link) {
      navigate(link);
      setShowNotifications(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/doctor");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <Link
          className="navbar-brand text-primary fw-bold"
          to="/doctor/dashboard"
        >
          MedicalApp
        </Link>

        <div className="collapse navbar-collapse justify-content-between">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/doctor/patients">
                <FaUserInjured className="me-2" /> Patients
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/doctor/appointments">
                <FaCalendarAlt className="me-2" /> Appointments
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* Notification Bell */}
            <li
              className="nav-item dropdown me-3 notification-container"
              ref={notificationRef}
            >
              <button
                className="btn btn-outline-dark position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="badge bg-danger position-absolute top-0 end-0">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <ul className="dropdown-menu notifications-menu">
                  <li className="dropdown-header">Notifications</li>
                  {notifications.length === 0 ? (
                    <li className="dropdown-item text-muted">
                      No new notifications
                    </li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="dropdown-item"
                        onClick={() =>
                          handleNotificationClick(notification.link)
                        }
                        style={{
                          cursor: notification.link ? "pointer" : "default",
                        }}
                      >
                        {notification.message}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown profile-dropdown" ref={profileRef}>
              <button
                className="btn btn-outline-dark dropdown-toggle profile-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                <FaUser className="me-2" /> {doctorName}
              </button>

              {showProfile && (
                <ul className="dropdown-menu profile-dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowUpdateProfile(true)}
                    >
                      <FaCog /> Update Profile
                    </button>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/doctor/change-password"
                    >
                      <FaKey /> Change Password
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
