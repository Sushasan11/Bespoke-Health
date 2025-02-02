import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import "../../styles/navbarCss.css";

function DoctorNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("Doctor"); // Default name
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch logged-in doctor's name
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("/me/");
        setDoctorName(response.data.name || "Doctor");
      } catch (error) {
        console.error("Failed to fetch doctor data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDoctorData();
  }, [navigate]);

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {/* Left Side Navigation */}
      <div className="nav-links">
        <Link to="/get-patient">Get Patient</Link>
      </div>

      {/* Right Side - Profile & Logout */}
      <div className="right-nav">
        <div
          ref={dropdownRef}
          className="profile-container"
          onClick={toggleDropdown}
        >
          {doctorName} ▼
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

        <button onClick={handleLogout} className="logout-button">
          LogOut
        </button>
      </div>
    </nav>
  );
}

export default DoctorNavbar;
