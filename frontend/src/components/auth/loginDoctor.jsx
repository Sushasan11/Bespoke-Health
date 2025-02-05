import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";

function LoginDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/login/doctor", {
        email: email.trim(),
        password: password,
      });

      const { access_token, is_verified } = response.data;

      // Store the access token in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("is_verified", is_verified ? "true" : "false");

      // Redirect based on KYC status
      if (!is_verified) {
        alert("Please verify your KYC before accessing features.");
        navigate("/doctor/kyc-warning");
      } else {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      alert(
        error.response?.data?.detail || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup/doctor">Signup here</a>
      </p>
    </div>
  );
}

export default LoginDoctor;
