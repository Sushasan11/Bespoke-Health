import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../../routes/axios";
import "../../styles/doctorLoginCss.css";

function PatientLogin() {
  // State for handling input fields and messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle manual login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/login/", { email, password });

      if (response.data.access_token) {
        // Store token and email in local storage
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user_email", email);

        // Store KYC notification if required
        if (response.data.kyc_message) {
          localStorage.setItem("kyc_notification", response.data.kyc_message);
        } else {
          localStorage.removeItem("kyc_notification");
        }

        // Fetch user role and navigate
        const userRes = await axios.get("/me/");
        navigate(
          userRes.data.role === "doctor"
            ? "/doctor/dashboard"
            : "/patient/dashboard"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In Success
  const handleGoogleSuccess = async (response) => {
    try {
      const googleRes = await axios.post(
        "/auth/google/patient/",
        { token: response.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store access token
      localStorage.setItem("token", googleRes.data.access_token);
      localStorage.setItem("user_email", googleRes.data.email);

      // Store KYC notification if required
      if (googleRes.data.kyc_message) {
        localStorage.setItem("kyc_notification", googleRes.data.kyc_message);
      } else {
        localStorage.removeItem("kyc_notification");
      }

      navigate("/patient/dashboard");
    } catch (error) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="container-fluid login-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4 p-sm-5">
              <h2 className="card-title text-center mb-4">Patient Login</h2>

              {/* Manual Login Form */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${
                      error ? "is-invalid" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className={`form-control form-control-lg ${
                      error ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>

              {/* Google Login */}
              <div className="text-center my-3">
                <p>Or sign in with Google:</p>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign-In failed.")}
                />
              </div>

              {/* Links to Signup and Password Reset */}
              <div className="text-center">
                <p className="mb-2">
                  Don't have an account?{" "}
                  <Link to="/signup/patient" className="text-primary">
                    Register here
                  </Link>
                </p>
                <p className="mb-0">
                  Forgot your password?{" "}
                  <Link to="/request-password-reset" className="text-primary">
                    Reset it here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;
