import React from "react";
import { Link } from "react-router-dom";
import "../styles/homeCss.css";

function Home() {
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          {/* Replace with actual logo */}
          <h1>
            Health DOM Logo
          </h1>
          <nav className="header-links">
            <Link to="/login" className="header-button">
              Login
            </Link>
            <Link to="/signup/patient" className="header-button">
              Patient Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2>Your Health, Our Priority</h2>
        <p>
          Health DOM is committed to providing top-notch medical care for
          patients and supporting doctors in their healthcare journey.
        </p>
        <div className="cta-container">
          <Link to="/signup/patient" className="cta-button">
            Join as Patient
          </Link>
          <Link to="/signup/doctor" className="cta-button doctor">
            Join as Doctor
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>Are you a doctor?</p>
          <Link to="/signup/doctor" className="footer-button">
            Doctor Signup
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
