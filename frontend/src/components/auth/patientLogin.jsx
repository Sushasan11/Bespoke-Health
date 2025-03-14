import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../../routes/axios";
import "react-toastify/dist/ReactToastify.css";

export default function PatientLogin() {
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
      setTimeout(() => navigate("/patient/dashboard"), 2000);
    } catch (error) {
      let errorMsg =
        error.response?.data?.detail || "An error occurred. Please try again.";
      if (error.message.includes("Network Error")) {
        errorMsg = "Cannot connect to server. Check your internet.";
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100 p-6"
    >
      <ToastContainer />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Patient Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/patient/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here.
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
