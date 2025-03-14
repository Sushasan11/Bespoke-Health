import { useEffect } from "react";
import { motion } from "framer-motion";

function HomePopup({ service, onClose }) {
  // Close popup when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center p-6 z-50 bg-opacity-40"
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Popup Content */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Image Section */}
          <motion.img
            src={service.img}
            alt={service.title}
            className="w-full md:w-1/2 rounded-md shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-[#6A0572] font-bold text-lg">
              {service.title}
            </h2>
            <p className="mt-3 text-[#333333] text-base leading-relaxed">
              {service.details}
            </p>
            <motion.a
              href="#schedule"
              className="text-[#FF6B6B] font-semibold mt-4 inline-block hover:underline text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Appointment
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePopup;
