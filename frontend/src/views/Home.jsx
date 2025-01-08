import React from "react";
import { Link } from "react-router-dom";
import "../styles/homeCss.css";

function Home() {
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1>**Logo**</h1>
          <div className="header-links">
            <Link to="/login" className="header-link">
              Login
            </Link>
            <Link to="/signup/patient" className="header-link">
              Patient Signup
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2>Your Health, Our Priority</h2>
        <p>
          Health DOM is committed to providing top-notch medical care for
          patients and supporting doctors in their healthcare journey.
        </p>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>Are you a doctor?</p>
          <Link to="/signup/doctor" className="footer-link">
            Doctor Signup
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
