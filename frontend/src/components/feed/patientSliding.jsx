import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Importing images for the slider
import slide1 from "../../assets/patientsliding1.jpg";
import slide2 from "../../assets/patientsliding2.jpg";
import slide3 from "../../assets/patientsliding3.jpg";
import slide4 from "../../assets/patientsliding4.jpg";

export default function PatientSliding() {
  // Array of slides with images, titles, and subtitles
  const slides = [
    {
      image: slide1,
      title: "Stay Healthy Together",
      subtitle: "Quality healthcare services for you and your loved ones.",
    },
    {
      image: slide2,
      title: "Access Medicines Easily",
      subtitle: "Get your prescribed medicines delivered at your doorstep.",
    },
    {
      image: slide3,
      title: "Family and Happiness",
      subtitle: "We care for your family's well-being and happiness.",
    },
    {
      image: slide4,
      title: "Get a Personalized Yoga Tutor",
      subtitle: "Experience wellness with guided yoga sessions.",
    },
  ];

  // State for the current index of the slide
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fade in and out transition for slides
  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
      transition: {
        duration: 4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <div className="relative w-full mt-15 h-[500px] overflow-hidden rounded-lg">
      {/* Carousel Container with fading effect */}
      <motion.div
        className="absolute w-full h-full flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${slides[currentIndex].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial="enter"
        animate="center"
        exit="exit"
        variants={slideVariants}
      >
        {/* Frosted Glass Effect for Text */}
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg text-center max-w-lg">
          <h1 className="text-4xl font-bold text-gray-900">
            {slides[currentIndex].title}
          </h1>
          <p className="mt-2 text-lg text-gray-800">
            {slides[currentIndex].subtitle}
          </p>
          <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Dots for manual slide navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition cursor-pointer ${
              index === currentIndex
                ? "bg-red-500 scale-125"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
