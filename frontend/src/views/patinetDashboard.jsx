import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { getDepartments } from "../routes/departmentRoutes";
import PatientDepartment from "../components/feed/patientDepartment";
import PatientSliding from "../components/feed/patientSliding";
import PatientDoctorSection from "../components/feed/patientDoctorSection";
import PatientNavbar from "../components/navbar/patientNavbar";
import PatientFooter from "../components/footer/patientFooter";
import { onMessage } from "firebase/messaging";
import { messaging } from "../context/firebase"; // Firebase import

function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [localNotifications, setLocalNotifications] = useState([]);

  /* Fetch department data when navigating back */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        if (!Array.isArray(data)) {
          throw new Error("Invalid department data received.");
        }
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching department data:", error);
        toast.error("Failed to load departments.");
      }
    };
    fetchDepartments();
  }, [location]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const message = payload.notification.body;
      toast.info(message);
      setLocalNotifications((prev) => [...prev, message]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <PatientNavbar />

      <motion.div
        className="max-w-7xl mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Notification Banner */}
        {localNotifications.length > 0 && (
          <motion.div
            className="bg-yellow-500 text-white text-center py-2 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {localNotifications[localNotifications.length - 1]}
          </motion.div>
        )}

        {/* Sliding Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <PatientSliding />
        </motion.div>

        {/* Departments Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <PatientDepartment />
        </motion.div>

        {/* Doctors Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <PatientDoctorSection departments={departments} />
        </motion.div>
      </motion.div>

      <PatientFooter />
    </>
  );
}

export default PatientDashboard;
