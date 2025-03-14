import { motion } from "framer-motion";

function PatientDoctorSection({ departments }) {
  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        Our Top Doctors
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {departments.slice(0, 3).map((dept, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 text-center transform transition duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-bold text-lg">{dept.name} Specialist</h3>
            <p className="text-gray-600">Available for consultation</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Book Now
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default PatientDoctorSection;
