import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./views/Home";
import Login from "./components/auth/login";
import SignupPatient from "./components/auth/signupPatient";
import OTPRequest from "./views/otpRequest";
import OTPverify from "./views/otpverify";
import PasswordReset from "./components/auth/passwordReset";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route to Home */}
        <Route path="/" element={<Home />} />

        {/* User Login */}
        <Route path="/login" element={<Login />} />

        {/* Patient Signup */}
        <Route path="/signup/patient" element={<SignupPatient />} />

        {/* OTP and Password Reset Routes */}
        <Route path="/request-otp" element={<OTPRequest />} />
        <Route path="/verify-otp" element={<OTPverify />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Fallback route to handle incorrect URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
