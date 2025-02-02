import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./views/home";
import Login from "./components/auth/patientLogin";
import SignupPatient from "./components/auth/signupPatient";
import OTPRequest from "./views/otpRequest";
import OTPVerify from "./views/otpVerify";
import PasswordReset from "./components/auth/passwordReset";
import PatientHome from "./views/patientHome";
import UpdateProfile from "./components/navbar/updateProfile";
import ChangePassword from "./components/navbar/changePassword";
import PatientNavbar from "./components/navbar/patientNavbar";

// 🔹 Optimized Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<SignupPatient />} />
        <Route path="/request-password-reset" element={<OTPRequest />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Protected Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute>
              <PatientNavbar />
              <PatientHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <PatientNavbar />
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <PatientNavbar />
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* 🔻 Catch-All 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
