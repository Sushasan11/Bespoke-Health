import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

// Import components
import NavbarComponent from "../components/navbar/doctorNavbar";
import FooterComponent from "../components/footer/doctorFooter";
import axios from "../routes/axios";
import "../style/doctor.css";

const DoctorDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalEarnings: 0,
    completedAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, appointmentsRes, patientsRes] = await Promise.all([
          axios.get("/doctor/stats"),
          axios.get("/doctor/appointments/upcoming"),
          axios.get("/doctor/patients/recent"),
        ]);

        setStats(statsRes.data || {});
        setUpcomingAppointments(appointmentsRes.data || []);
        setRecentPatients(patientsRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Doctor
        </h1>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total Patients", key: "totalPatients" },
            { label: "Today's Appointments", key: "todayAppointments" },
            { label: "Completed Appointments", key: "completedAppointments" },
            { label: "Total Earnings", key: "totalEarnings" },
          ].map((stat, index) => (
            <motion.div key={index} className="bg-white shadow rounded-lg p-5">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-lg font-medium text-gray-900">
                {isLoading ? "Loading..." : stats[stat.key] || "N/A"}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Appointments Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          <div className="bg-white shadow rounded-lg p-5">
            {isLoading ? (
              <p>Loading...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <ul>
                {upcomingAppointments.map((appointment, index) => (
                  <li key={index} className="border-b py-3">
                    <p className="text-gray-800">{appointment.patientName}</p>
                    <p className="text-gray-500">
                      {appointment.appointmentTime}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Recent Patients Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Patients
          </h2>
          <div className="bg-white shadow rounded-lg p-5">
            {isLoading ? (
              <p>Loading...</p>
            ) : recentPatients.length === 0 ? (
              <p>No recent patients.</p>
            ) : (
              <ul>
                {recentPatients.map((patient, index) => (
                  <li key={index} className="border-b py-3">
                    <p className="text-gray-800">{patient.name}</p>
                    <p className="text-gray-500">{patient.lastVisitDate}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default DoctorDashboard;
