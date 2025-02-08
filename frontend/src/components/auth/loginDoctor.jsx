import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import "../../styles/doctorLoginCss.css";

function LoginDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/login/doctor", {
        email: email.trim(),
        password: password,
      });

      const { access_token, kyc_status } = response.data;

      if (kyc_status !== "approved") {
        setError("Your KYC is not approved yet. Please wait for verification.");
        setLoading(false);
        return;
      }

      // Store the access token and KYC status
      localStorage.setItem("token", access_token);
      localStorage.setItem("kyc_status", kyc_status);

      navigate("/doctor/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("User is not registered. Please sign up.");
        } else if (error.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(error.response.data?.detail || "Login failed.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4 p-sm-5">
              <h2 className="card-title text-center mb-4">Doctor Login</h2>

              {/* Error Message */}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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

              <div className="text-center">
                <p className="mb-2">
                  Don't have an account?{" "}
                  <a href="/signup/doctor" className="text-primary">
                    Signup here
                  </a>
                </p>
                <p className="mb-0">
                  Forgot password?{" "}
                  <a href="/reset-password" className="text-primary">
                    Reset it here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDoctor;
