import React, { useState } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";

function SignupPatient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoading(true);

    // Validate Email and Password
    if (!validateEmail(email)) {
      setMessage("Invalid email format.");
      setError(true);
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/signup/patient/", {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage("Signup successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage("Email is already registered. Try logging in.");
        } else {
          setMessage(
            `Error ${error.response.status}: ${
              error.response.data.detail || "Unknown error"
            }`
          );
        }
      } else if (error.request) {
        setMessage(
          "No response from server. Please check your internet connection."
        );
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
      <h2>Signup for Patients</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}
    </div>
  );
}

export default SignupPatient;
