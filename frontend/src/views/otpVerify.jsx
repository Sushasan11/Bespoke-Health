import React, { useState, useEffect } from "react";
import axios from "../routes/axios";
import { useNavigate } from "react-router-dom";

function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("email");

  // Redirect user if email is missing
  useEffect(() => {
    if (!storedEmail) {
      navigate("/request-otp");
    }
  }, [storedEmail, navigate]);

  // Validate OTP format
  const isValidOTP = (otp) => /^\d{6}$/.test(otp); // Ensures OTP is 6-digit number

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    // Check if OTP is valid
    if (!isValidOTP(otp)) {
      setMessage("OTP must be a 6-digit number.");
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/verify-password-reset-otp/", {
        email: storedEmail,
        otp: parseInt(otp, 10), 
      });

      if (response.status === 200) {
        // Store OTP verification status
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("verifiedOtp", otp);

        // OTP verified successfully, redirect to reset-password
        setMessage("OTP verified successfully.");
        setTimeout(() => {
          navigate("/reset-password", { replace: true });
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setMessage(`Error ${status}: ${data.detail || "Invalid OTP"}`);
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <form onSubmit={handleOTPVerify}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}
    </div>
  );
}

export default OTPVerify;
