import { useEffect, useState } from "react";
import { getDepartments } from "../../routes/departmentRoutes";
import { motion } from "framer-motion";
import PatientDepartmentModal from "../modal/patientDepartmnetModal";

export default function PatientDepartment() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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
    <div className="py-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Explore Departments
      </h2>

      {/* Department List */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {departments.map((dept) => (
          <motion.div
            key={dept.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer transform transition duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedDepartment(dept)}
          >
            <h3 className="font-semibold text-lg text-gray-800">{dept.name}</h3>
            <img
              src={`http://127.0.0.1:8000${dept.image_url.replace("//", "/")}`}
              alt={dept.name}
              className="w-12 h-12 object-cover rounded-lg shadow-sm"
              onError={(e) => (e.target.src = "/default-image.png")}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Department Booking Modal */}
      {selectedDepartment && (
        <PatientDepartmentModal
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </div>
  );
}
