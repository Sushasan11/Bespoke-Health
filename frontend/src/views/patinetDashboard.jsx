import { useEffect, useState } from "react";
import { getDepartments } from "../routes/departmentRoutes";
import PatientDepartment from "../components/feed/patientDepartment";
import PatientSliding from "../components/feed/patientSliding";
import PatientDoctorSection from "../components/feed/patientDoctorSection";
import PatientNavbar from "../components/navbar/patientNavbar";
import PatientFooter from "../components/footer/patientFooter";
import { motion } from "framer-motion";

function PatientDashboard() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    }
    fetchData();
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
