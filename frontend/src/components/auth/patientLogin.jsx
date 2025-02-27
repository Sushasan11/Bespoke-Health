import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../routes/axios";
import "react-toastify/dist/ReactToastify.css";

function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/patient/login", { email, password });
      toast.success("Login successful!");
      navigate("/patient/dashboard");
    } catch (error) {
      const detail = error.response?.data?.detail;
      let errorMsg = detail || "An error occurred. Please try again.";
      // If error detail includes "not found" or "Invalid email or password", show appropriate message.
      if (
        detail &&
        (detail.includes("User not found") || detail.includes("not found"))
      ) {
        errorMsg = "User not found";
      } else if (detail === "Invalid email or password") {
        errorMsg = "Account not found";
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/patient/signup"
            className="text-blue-600 hover:underline"
            style={{ textDecoration: "none" }}
          >
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PatientLogin;
