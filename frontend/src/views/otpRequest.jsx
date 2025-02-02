import React, { useState } from "react";
import axios from "../routes/axios";
import { useNavigate } from "react-router-dom";

function OTPRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const navigate = useNavigate();

  const handleOTPRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoadingOtp(true);

    try {
      const response = await axios.post("/request-password-reset/", {
        email: email.trim(), // Ensure proper formatting
      });

      if (response.status === 200) {
        localStorage.setItem("email", email);
        setMessage("OTP has been sent to your email.");
        setTimeout(() => navigate("/verify-otp"), 2000);
      }
    } catch (error) {
      setError(true);
      setMessage(error.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div>
      <h2>Request OTP</h2>
      <form onSubmit={handleOTPRequest}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loadingOtp}>
          {loadingOtp ? "Sending OTP..." : "Request OTP"}
        </button>
      </form>
      {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}
    </div>
  );
}

export default OTPRequest;
