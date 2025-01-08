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
      const response = await axios.post("/request-otp/", { email });

      if (response.status === 200) {
        // Save email to localStorage
        localStorage.setItem("email", email);
        setMessage("OTP sent to your email.");
        setTimeout(() => {
          navigate("/verify-otp");
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.error("Error:", error.response);
        setMessage(`Error ${status}: ${data.detail || "Unknown error"}`);
      } else {
        setMessage("No response received. Please try again later.");
      }
      setError(true);
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
