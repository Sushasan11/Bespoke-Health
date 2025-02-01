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

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoading(true);

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
        setMessage(
          `Error ${error.response.status}: ${
            error.response.data.detail || "Unknown error"
          }`
        );
      } else {
        setMessage("No response received. Please try again later.");
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
