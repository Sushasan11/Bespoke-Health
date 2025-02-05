import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../routes/axios";
import "../styles/otpRequestCss.css";

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
    <div className="container otp-request-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-lg position-relative">
            <button
              className="btn btn-outline-secondary position-absolute top-0 start-0 m-3"
              onClick={() => navigate(-1)}
              type="button"
            >
              &larr; Back
            </button>
            <div className="card-body text-center">
              <h2 className="mb-4">Request OTP</h2>
              <form onSubmit={handleOTPRequest}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="btn btn-primary btn-lg"
                    disabled={loadingOtp}
                  >
                    {loadingOtp ? "Sending OTP..." : "Request OTP"}
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

export default OTPRequest;
