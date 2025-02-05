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
  const [isVerified, setIsVerified] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
        setIsVerified(response.data.is_verified);
      } catch (error) {
        console.error("Failed to fetch doctor data");
        localStorage.removeItem("token");
        navigate("/login/doctor");
      }
    };

    fetchDoctorData();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: "New patient appointment request", read: false },
      { id: 2, message: "Medical record updated", read: false },
      { id: 3, message: "Reminder: Staff meeting tomorrow", read: true },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/doctor");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-primary fw-bold" to="/doctor/dashboard">
          MedicalApp
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#doctorNavbar" aria-controls="doctorNavbar"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="doctorNavbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/doctor/patients">
                <FaUserInjured className="me-2" />
                Patients
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/doctor/appointments">
                <FaCalendarAlt className="me-2" />
                Appointments
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {!isVerified && (
              <li className="nav-item me-3">
                <div className="kyc-alert">
                  <FaExclamationCircle className="text-danger me-2" />
                  <span>Verify KYC</span>
                  <Link to="/doctor/update-profile" className="ms-2 text-primary fw-bold">
                    Update Now
                  </Link>
                </div>
              </li>
            )}

            <li className="nav-item dropdown me-3 notification-container" ref={notificationRef}>
              <button className="btn btn-outline-dark position-relative"
                onClick={() => setShowNotifications(!showNotifications)}>
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
                    <li className="dropdown-item text-muted">No new notifications</li>
                  ) : (
                    notifications.map((notification) => (
                      <li key={notification.id} className="dropdown-item">
                        {notification.message}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>

            <li className="nav-item dropdown" ref={profileRef}>
              <button className="btn btn-outline-dark dropdown-toggle"
                onClick={() => setShowProfile(!showProfile)}>
                <FaUser className="me-2" />
                {doctorName}
              </button>
              {showProfile && (
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/doctor/profile"><FaCog /> My Profile</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li>
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
