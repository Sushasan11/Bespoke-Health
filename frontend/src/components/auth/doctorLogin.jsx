import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../routes/axios";
import "react-toastify/dist/ReactToastify.css";

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/doctor/login", { email, password });
      toast.success("Login successful!");
      navigate("/doctor/dashboard");
    } catch (error) {
      let errorMsg =
        error.response?.data?.detail || "An error occurred. Please try again.";
      if (error.message.includes("Network Error")) {
        errorMsg = "Cannot connect to server. Check your internet.";
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F6] p-6">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#6A0572] mb-6">
          Doctor Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[#333333] font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[#333333] font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2b0c53] text-white py-2 rounded-md hover:bg-[#FF6B6B]/80 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/doctor/signup"
            className="text-[#6A0572] hover:underline font-medium"
          >
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DoctorLogin;
