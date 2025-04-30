import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to parse stored user data", err);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const signup = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
      setLoading(false);
      throw err;
    }
  };

  const verifyEmail = async (email, otp) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        email,
        otp,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Email verification failed");
      setLoading(false);
      throw err;
    }
  };

  const login = async (credentials) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, role, kyc_status } = response.data;

      localStorage.setItem("token", token);

      const userData = { role, kyc_status };
      localStorage.setItem("user", JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const forgotPassword = async (email) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process password reset");
      setLoading(false);
      throw err;
    }
  };

  const changePassword = async (token, newPassword) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
