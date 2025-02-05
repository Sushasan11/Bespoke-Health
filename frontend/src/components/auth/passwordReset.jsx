import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import "../../styles/passwordResetCss.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("email");
  const storedOtp = localStorage.getItem("verifiedOtp");

  // Redirects if OTP is not verified
  useEffect(() => {
    if (!storedOtp) {
      navigate("/request-otp");
    }
  }, [storedOtp, navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    // Password validation
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setError(true);
      return;
    }

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
        localStorage.removeItem("email");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      let errorMsg = "An unexpected error occurred.";

      if (error.response) {
        errorMsg =
          error.response.data.detail || "Invalid OTP or user not found";
      } else if (error.request) {
        errorMsg = "No response from server. Check your connection.";
      }

      setMessage(errorMsg);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container reset-password-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate(-1)}
              >
                &larr; Back
              </button>

              <h2 className="mb-4">Reset Password</h2>

              <form onSubmit={handlePasswordReset}>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Retype new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>

                {message && (
                  <div
                    className={`alert ${
                      error ? "alert-danger" : "alert-success"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
