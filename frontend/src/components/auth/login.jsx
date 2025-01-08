import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../routes/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/login/", { email, password });
      setMessage(response.data.message);

      // Check if the user is a doctor or a patient based on the email format
      if (email.endsWith(".doctor@gmail.com")) {
        navigate("/doctor/dashboard"); 
      } else {
        navigate("/patient/dashboard"); 
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || "Login Failed");
      } else {
        setMessage("Login Failed. Please try again.");
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
      {message && <p>{message}</p>}
      <p>
        Don&apos;t have an account?{" "}
        <Link to="/signup/patient">Register here</Link>
      </p>
      <p>
        Forgot your password? <Link to="/request-otp">Reset it here</Link>
      </p>
    </div>
  );
}

export default Login;
