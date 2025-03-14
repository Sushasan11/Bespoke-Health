import { motion } from "framer-motion";

export default function PatientDepartmentModal({ department, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 px-4  bg-opacity-50 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex overflow-hidden relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Department Image */}
        <div className="w-1/3">
          <img
            src={`http://127.0.0.1:8000${department.image_url.replace(
              "//",
              "/"
            )}`}
            alt={department.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/default-image.png")}
          />
        </div>

        {/* Modal Content */}
        <div className="w-2/3 p-6">
          {/* Close Button */}
          <button
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-lg"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-lg font-bold text-green-700 uppercase">
            {department.name}
          </h2>

          <p className="text-gray-600 mt-2">{department.description}</p>

          <button
            className="mt-4 text-blue-600 font-semibold hover:underline"
            onClick={() =>
              alert(`Booking an appointment for ${department.name}`)
            }
          >
            Schedule appointment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
