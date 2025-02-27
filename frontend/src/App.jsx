import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";

// Patient Routes
import PatientLogin from "./components/auth/PatientLogin";
import PatientSignup from "./components/auth/patientSignup";

// Doctor Routes
import DoctorSignup from "./components/auth/doctorSignup";
import DoctorLogin from "./components/auth/doctorLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Patient Routes */}
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/signup" element={<PatientSignup />} />

      {/* Doctor Routes */}
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
    </Routes>
  );
}

export default App;
