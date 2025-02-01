import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./views/home"
import Login from "./components/auth/login";
import SignupPatient from "./components/auth/signupPatient";
import OTPRequest from "./views/otpRequest";
import OTPVerify from "./views/otpVerify";
import PasswordReset from "./components/auth/passwordReset";
import PatientHome from "./views/patientHome";

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Show loading state while checking auth
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<SignupPatient />} />
        <Route path="/request-otp" element={<OTPRequest />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Protected Routes: Requires Authentication */}
        <Route
          path="/patient/dashboard"
          element={<ProtectedRoute element={<PatientHome />} />}
        />

        {/* Fallback Route for 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
