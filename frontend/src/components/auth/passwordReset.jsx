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

  const storedEmail = localStorage.getItem("email");
  const otpVerified = localStorage.getItem("otpVerified");
  const verifiedOtp = localStorage.getItem("verifiedOtp"); 
  useEffect(() => {
    // Check if OTP is verified, if not redirect to OTP entry
    if (!otpVerified) {
      navigate("/verify-otp"); 
    }
  }, [otpVerified, navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setError(false);
    setLoadingPassword(true);

    // Check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      setError(true);
      setLoadingPassword(false);
      return; // Prevent form submission
    }

    try {
      // Send the request with email, new password, and the verified OTP
      const response = await axios.post("/reset-password/", {
        email: storedEmail,
        new_password: newPassword,
        otp: parseInt(verifiedOtp), // Use the verified OTP from localStorage
      });

      if (response.status === 200) {
        setPasswordMessage("Password reset successfully.");
        // Clear OTP verification status after successful reset
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("verifiedOtp"); // Clear the OTP after password reset
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setPasswordMessage(
          `Error ${status}: ${data.detail || "Unknown error"}`
        );
      } else {
        setPasswordMessage("No response received. Please try again later.");
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
