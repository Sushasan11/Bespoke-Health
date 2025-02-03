import React, { useState } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("email");
  const storedOtp = localStorage.getItem("verifiedOtp");

  // Resets the password using the verified OTP
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    // Check if OTP is verified
    if (!storedOtp) {
      setMessage("OTP not verified. Please verify OTP first.");
      setError(true);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/reset-password/", {
        email: storedEmail.trim(),
        new_password: newPassword,
        otp: Number(storedOtp),
      });

      if (response.status === 200) {
        setMessage("Password reset successfully.");
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("verifiedOtp");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          `Error ${error.response.status}: ${
            error.response.data.detail || "Invalid OTP or user not found"
          }`
        );
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
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Retype new password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}
    </div>
  );
}

export default ResetPassword;
