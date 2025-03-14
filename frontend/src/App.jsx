import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./views/Home";

// Authentication
import PatientLogin from "./components/auth/patientLogin";
import PatientSignup from "./components/auth/patientSignup";
import DoctorLogin from "./components/auth/doctorLogin";
import DoctorSignup from "./components/auth/doctorSignup";

// Patient Dashboard
import PatientDashboard from "./views/patinetDashboard";

// Navbar
import HomeNavbar from "./components/navbar/homeNavbar";

// Protected Route Component
import ProtectedRoute from "./routes/protectedRoutes";

function App() {
  const location = useLocation();

  // Show navbar only on these routes
  const showNavbar = [
    "/",
    "/patient/login",
    "/patient/signup",
    "/doctor/login",
    "/doctor/signup",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F4F6F6] text-[#333333] transition-all">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Conditionally Render HomeNavbar */}
      {showNavbar && <HomeNavbar />}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />

        {/* Protected Routes*/}
        <Route element={<ProtectedRoute role="patient" />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
