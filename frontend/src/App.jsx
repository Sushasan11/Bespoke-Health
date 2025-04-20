import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Home from "./views/Home";
import "./style/index.css";
import { generateToken, messaging } from "./context/firebase";
import { onMessage } from "firebase/messaging";

// Authentication
import PatientLogin from "./components/auth/patientLogin";
import PatientSignup from "./components/auth/patientSignup";
import DoctorLogin from "./components/auth/doctorLogin";
import DoctorSignup from "./components/auth/doctorSignup";

// Patient Dashboard & Features
import PatientDashboard from "./views/patinetDashboard";
import PatientKYC from "./components/feed/patientKyc";
import PatientProfile from "./components/profile/patientProfile";

// Doctor Dashboard & Features
import DoctorDashboard from "./views/doctorDashboard";

// Navbar
import HomeNavbar from "./components/navbar/homeNavbar";

// Protected Route Component
import ProtectedRoute from "./routes/protectedRoutes";

function App() {
  const location = useLocation();
  const hasRun = useRef(false);

  const showNavbar = [
    "/",
    "/patient/login",
    "/patient/signup",
    "/doctor/login",
    "/doctor/signup",
  ].includes(location.pathname);

  useEffect(() => {
    if (!hasRun.current) {
      generateToken();
      hasRun.current = true;
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      toast(payload.notification.body); // Show notification toast
    });

    return () => {
      // Clean up the subscription on unmount to avoid memory leaks
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F6] text-[#333333] transition-all">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {showNavbar && <HomeNavbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />

        {/* Protected Patient Routes */}
        <Route element={<ProtectedRoute role="patient" />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/kyc" element={<PatientKYC />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>

        {/* Protected Doctor Routes */}
        <Route element={<ProtectedRoute role="doctor" />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
