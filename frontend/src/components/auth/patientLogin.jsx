import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../routes/axios";

function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation: Prevent empty email/password submission
    if (!email.trim() || !password.trim()) {
      setMessage("Email and password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/login/", { email, password });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user_email", email);

        setMessage("Login successful! Redirecting...");

        // Fetch user details to determine role
        const userRes = await axios.get("/me/");

        // Redirect based on role (doctors have `specialization` field)
        if (userRes.data.specialization) {
          navigate("/doctor/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      }
    } catch (error) {
      if (error.response) {
        // API responded with an error
        if (error.response.status === 401) {
          setMessage("Invalid credentials. Please try again.");
        } else {
          setMessage(
            `Error ${error.response.status}: ${
              error.response.data.detail || "Login failed"
            }`
          );
        }
      } else if (error.request) {
        // No response from server
        setMessage(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Other errors (e.g., frontend bugs)
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <p>
        Don&apos;t have an account?{" "}
        <Link to="/signup/patient">Register here</Link>
      </p>
      <p>
        Forgot your password?{" "}
        <Link to="/request-password-reset">Reset it here</Link>
      </p>
    </div>
  );
}

export default PatientLogin;
