import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // State variables for tracking current index and transition direction
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaded(false); // Hide text before transition
      const nextIndex = (index + 1) % slides.length;

      // Preload next image before changing slide
      const img = new Image();
      img.src = slides[nextIndex].image;
      img.onload = () => {
        setIndex(nextIndex);
        setDirection(1);
        setLoaded(true);
      };
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  const handleDotClick = (newIndex) => {
    if (newIndex !== index) {
      setLoaded(false);
      const img = new Image();
      img.src = slides[newIndex].image;
      img.onload = () => {
        setIndex(newIndex);
        setDirection(newIndex > index ? 1 : -1);
        setLoaded(true);
      };
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    /* Slider container with spacing from navbar */
    <div className="relative w-full mt-24 h-[500px] overflow-hidden rounded-lg">
      {/* Slide Animation using AnimatePresence */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute w-full h-full flex items-center justify-center text-white"
          style={{
            backgroundImage: `url(${slides[index].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Frosted Glass Effect for Text */}
          <motion.div
            className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg text-center max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900">
              {slides[index].title}
            </h1>
            <p className="mt-2 text-lg text-gray-800">
              {slides[index].subtitle}
            </p>
            <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Clickable Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full transition cursor-pointer ${
              i === index
                ? "bg-red-500 scale-125"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
