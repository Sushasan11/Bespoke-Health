import React from "react";
import { Link } from "react-router-dom";
import "../styles/homeCss.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Header */}
      <header className="header fixed-top">
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <svg
                className="health-logo me-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 4v16m-8-8h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Bespoke Health</span>
            </Link>

            <div className="navbar-nav ms-auto">
              <Link to="/login" className="nav-link btn btn-link">
                Login
              </Link>
              <Link
                to="/signup/patient"
                className="nav-link btn btn-primary ms-3"
              >
                Patient Signup
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container text-center">
            <h1 className="display-4 mb-4">Your Health, Our Priority</h1>
            <p className="lead mb-5">
              Bespoke Health is committed to providing top-notch medical care
              for patients and supporting doctors in their healthcare journey.
            </p>
            <div className="cta-buttons">
              <Link
                to="/signup/patient"
                className="btn btn-primary btn-lg me-3"
              >
                Join as Patient
              </Link>
              <Link
                to="/signup/doctor"
                className="btn btn-outline-primary btn-lg"
              >
                Join as Doctor
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="feature-item text-center">
                  <div className="feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12 4v16m-8-8h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Easy Appointments</h3>
                  <p>
                    Schedule appointments with your preferred healthcare
                    providers effortlessly
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item text-center">
                  <div className="feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Digital Records</h3>
                  <p>
                    Access your medical history and documents anytime, anywhere
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item text-center">
                  <div className="feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Secure Communication</h3>
                  <p>
                    Communicate with your healthcare providers securely and
                    efficiently
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p className="mb-4">Already a healthcare provider?</p>
          <Link to="/login/doctor" className="btn btn-primary btn-lg">
            Save Life as Doctor
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
