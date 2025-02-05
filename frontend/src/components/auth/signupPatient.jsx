import React, { useState } from "react";
import axios from "../../routes/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";

function SignupPatient() {
  // State for handling user input and form messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Function to validate password length
  const validatePassword = (password) => password.length >= 8;

  // Function to handle manual signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoading(true);

    // Validate email format
    if (!validateEmail(email)) {
      setMessage("Invalid email format.");
      setError(true);
      setLoading(false);
      return;
    }

    // Validate password length
    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long.");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      // Send signup request to the backend
      const response = await axios.post("/signup/patient/", {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage("Signup successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Email is already registered. Try logging in.");
      } else {
        setMessage("Signup failed. Please try again.");
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google OAuth signup
  const handleGoogleSignup = async (response) => {
    try {
      // Send Google OAuth token to the backend
      const googleRes = await axios.post(
        "/auth/google/patient/",
        { token: response.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store access token in local storage
      localStorage.setItem("token", googleRes.data.access_token);
      localStorage.setItem("user_email", googleRes.data.email);

      // Redirect to patient dashboard
      navigate("/patient/dashboard");
    } catch (error) {
      setMessage("Google Sign-Up failed. Please try again.");
      setError(true);
    }
  };

  return (
    <div className="container-fluid signup-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <h2 className="card-title">Patient Signup</h2>
                <p className="text-muted">Create your account to get started</p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
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

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </form>

              {/* Google OAuth Signup */}
              <div className="text-center my-3">
                <p>Or sign up with Google:</p>
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => setMessage("Google Sign-Up failed.")}
                />
              </div>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary text-decoration-none"
                  >
                    Login now
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

export default SignupPatient;
