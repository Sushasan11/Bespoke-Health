import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";

function SignupDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/signup/doctor", { email, password });
      alert(
        "Signup successful! Check your email for KYC verification instructions."
      );
      navigate("/login/doctor");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Doctor Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login/doctor">Login here</a>
      </p>
    </div>
  );
}

export default SignupDoctor;
