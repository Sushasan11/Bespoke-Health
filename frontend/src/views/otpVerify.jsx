import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../routes/axios";
import "../styles/otpVerifyCss.css";

function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!storedEmail) {
      navigate("/request-otp");
    }
  }, [storedEmail, navigate]);

  const isValidOTP = (otp) => /^\d{6}$/.test(otp);

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!isValidOTP(otp)) {
      setMessage("OTP must be a 6-digit number.");
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/verify-reset-otp/", {
        email: storedEmail.trim(),
        otp: Number(otp),
      });

      if (response.status === 200) {
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("verifiedOtp", otp);
        setMessage("OTP verified successfully.");

        setTimeout(() => {
          navigate("/reset-password", { replace: true });
        }, 2000);
      }
    } catch (error) {
      let errorMsg = "Invalid OTP.";
      if (error.response) {
        errorMsg = error.response.data.detail || errorMsg;
      } else if (error.request) {
        errorMsg = "No response from server. Check your connection.";
      } else {
        errorMsg = "An unexpected error occurred. Please try again.";
      }

      setMessage(errorMsg);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container otp-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card shadow-lg">
            <div className="card-body position-relative">
              <button
                className="btn btn-outline-secondary position-absolute top-0 start-0 m-3"
                onClick={() => navigate(-1)}
                type="button"
              >
                &larr; Back
              </button>

              <h2 className="text-center mb-4">Enter OTP</h2>

              <form onSubmit={handleOTPVerify}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control text-center"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>

                {message && (
                  <div
                    className={`alert ${
                      error ? "alert-danger" : "alert-success"
                    }`}
                    role="alert"
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
                    {loading ? "Verifying..." : "Verify OTP"}
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

export default OTPVerify;
