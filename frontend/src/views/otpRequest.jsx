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
        email: email.trim(),
      });

      if (response.status === 200) {
        localStorage.setItem("email", email);
        setMessage("OTP has been sent to your email.");
        setTimeout(() => navigate("/verify-reset-otp"), 2000);
      }
    } catch (error) {
      let errorMsg = "Failed to send OTP.";

      if (error.response) {
        // Server responded with an error
        errorMsg = error.response.data?.detail || errorMsg;
      } else if (error.code === "ECONNABORTED") {
        errorMsg = "Request timed out. Try again.";
      } else {
        errorMsg =
          "Could not connect to the server. Check your internet connection.";
      }

      setError(true);
      setMessage(errorMsg);
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
