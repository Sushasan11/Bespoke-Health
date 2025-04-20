import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./axios";

const ProtectedRoute = ({ role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      // Check session token in localStorage first
      const storedToken = localStorage.getItem(`${role}_session_token`);

      if (storedToken) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        // If no token in localStorage, check the session from the backend
        const endpoint =
          role === "doctor" ? "/doctor/session" : "/patient/session";
        const response = await api.get(endpoint);

        // If session token is present in the response, consider the user authenticated
        if (response.data.session_token) {
          localStorage.setItem(
            `${role}_session_token`,
            response.data.session_token
          ); // Store session token
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [role]);

  // While the session is being checked
  if (loading) {
    return <div className="text-center p-10">Checking session...</div>;
  }

  // If authenticated, render child routes, otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to={`/${role}/login`} />;
};

export default ProtectedRoute;
