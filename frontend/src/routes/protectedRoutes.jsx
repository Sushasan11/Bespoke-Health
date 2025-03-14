import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await api.get("/patient/session");
        if (response.data.session_token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Checking session...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/patient/login" />;
};

export default ProtectedRoute;
