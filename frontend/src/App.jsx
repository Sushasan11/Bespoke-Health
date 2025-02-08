import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./views/Home";

// Patient Components
import LoginPatient from "./components/auth/loginPatient";
import SignupPatient from "./components/auth/signupPatient";
import OTPRequest from "./views/otpRequest";
import OTPVerify from "./views/otpVerify";
import PasswordReset from "./components/auth/passwordReset";
import PatientHome from "./views/patientHome";
import UpdateProfile from "./components/profile/updateProfile";
import ChangePassword from "./components/navbar/changePassword";
import PatientNavbar from "./components/navbar/patientNavbar";

// Doctor Components
import LoginDoctor from "./components/auth/loginDoctor";
import SignupDoctor from "./components/auth/signupDoctor";
import DoctorHome from "./views/doctorHome";
import DoctorNavbar from "./components/navbar/doctorNavbar";
import DoctorProfile from "./components/profile/doctorProfile";
import UpdateDoctorProfile from "./components/profile/updateDoctorProfile";
import DoctorChangePassword from "./components/profile/doctorchangePassword";

// Protected Route for Patients
const ProtectedRoutePatient = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div className="loading text-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login/" replace />;
};

// Protected Route for Doctors (Includes KYC Check)
const ProtectedRouteDoctor = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: null,
    isVerified: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const kycStatus = localStorage.getItem("kyc_status");

    setAuthData({
      isAuthenticated: !!token,
      isVerified: kycStatus === "approved",
    });
  }, []);

  if (authData.isAuthenticated === null || authData.isVerified === null) {
    return <div className="loading text-center">Loading...</div>;
  }

  if (!authData.isAuthenticated) {
    return <Navigate to="/login/doctor" replace />;
  }

  if (!authData.isVerified) {
    return <Navigate to="/doctor/kyc-warning" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Patient Routes */}
        <Route path="/login/" element={<LoginPatient />} />
        <Route path="/signup/patient" element={<SignupPatient />} />
        <Route path="/request-password-reset" element={<OTPRequest />} />
        <Route path="/verify-reset-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Doctor Routes */}
        <Route path="/login/doctor" element={<LoginDoctor />} />
        <Route path="/signup/doctor" element={<SignupDoctor />} />

        {/* Protected Routes for Patients */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoutePatient>
              <PatientHome />
            </ProtectedRoutePatient>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoutePatient>
              <UpdateProfile />
            </ProtectedRoutePatient>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoutePatient>
              <ChangePassword />
            </ProtectedRoutePatient>
          }
        />

        {/* Protected Routes for Doctors */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRouteDoctor>
              <DoctorHome />
            </ProtectedRouteDoctor>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRouteDoctor>
              <DoctorProfile />
            </ProtectedRouteDoctor>
          }
        />
        <Route
          path="/doctor/update-profile"
          element={
            <ProtectedRouteDoctor>
              <UpdateDoctorProfile />
            </ProtectedRouteDoctor>
          }
        />
        <Route
          path="/doctor/change-password"
          element={
            <ProtectedRouteDoctor>
              <DoctorChangePassword />
            </ProtectedRouteDoctor>
          }
        />

        {/* Doctor KYC Warning Page */}
        <Route
          path="/doctor/kyc-warning"
          element={
            <div className="kyc-warning text-center">
              <h2 className="text-danger">KYC Pending</h2>
              <p className="lead">
                Please complete your KYC verification to access features.
              </p>
              <a href="/doctor/update-profile" className="btn btn-primary">
                Update KYC
              </a>
            </div>
          }
        />

        {/* Catch-All 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
