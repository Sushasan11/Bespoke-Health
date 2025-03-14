import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function HomePopupCarousel({ services, selectedIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        navigate(1);
      } else if (event.key === "ArrowLeft") {
        navigate(-1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const navigate = (direction) => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + direction + services.length) % services.length
    );
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center p-6 z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-gray-600 hover:text-gray-900 text-3xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Left Section: Image */}
        <div className="md:w-1/2">
          <img
            src={services[currentIndex].img}
            alt={services[currentIndex].title}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Right Section: Content */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[#6A0572] font-bold text-lg">
              {services[currentIndex].title}
            </h2>
            <p className="mt-4 text-[#333333] text-lg leading-relaxed">
              {services[currentIndex].details}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="text-gray-600 hover:text-gray-900 text-xl font-bold p-3 rounded-md transition duration-200"
              onClick={() => navigate(-1)}
            >
              ‹
            </button>
            <span className="text-gray-500 text-lg font-semibold">
              {currentIndex + 1} / {services.length}
            </span>
            <button
              className="text-gray-600 hover:text-gray-900 text-xl font-bold p-3 rounded-md transition duration-200"
              onClick={() => navigate(1)}
            >
              ›
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePopupCarousel;
