import React, { useState, useEffect } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const navigate = useNavigate();

  // Retrieve stored email and OTP
  const storedEmail = localStorage.getItem("email");
  const otpVerified = localStorage.getItem("otpVerified");
  const verifiedOtp = localStorage.getItem("verifiedOtp");

  // Redirect if OTP is not verified
  useEffect(() => {
    if (!otpVerified || otpVerified !== "true") {
      navigate("/verify-otp");
    }
  }, [otpVerified, navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setError(false);
    setLoadingPassword(true);

    // Validate email and OTP before making request
    if (!storedEmail || !verifiedOtp) {
      setPasswordMessage("Invalid OTP session. Please request a new OTP.");
      setError(true);
      setLoadingPassword(false);
      return;
    }

    // Check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      setError(true);
      setLoadingPassword(false);
      return;
    }

    try {
      // Send password reset request
      const response = await axios.post("/reset-password/", {
        email: storedEmail,
        new_password: newPassword,
        otp: parseInt(verifiedOtp, 10),
      });

      if (response.status === 200) {
        setPasswordMessage("Password reset successfully.");
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("verifiedOtp");
        localStorage.removeItem("email");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setPasswordMessage(
          `Error ${status}: ${data.detail || "Unexpected error"}`
        );
      } else if (error.request) {
        setPasswordMessage("No response from server. Please try again later.");
      } else {
        setPasswordMessage("An error occurred. Please try again.");
      }
      setError(true);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={loadingPassword}>
          {loadingPassword ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {passwordMessage && (
        <p style={{ color: error ? "red" : "green" }}>{passwordMessage}</p>
      )}
    </div>
  );
}

export default PasswordReset;
