import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import homebg from "../../assets/homebg.png";

function HomeHeroSection() {
  const { scrollYProgress } = useScroll();

  // Transform Hero Section opacity and scale based on scroll
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Function to smoothly scroll to HomePersonalizedCare
  const scrollToSection = () => {
    const section = document.getElementById("personalized-care");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-[#FF6B6B] to-[#6A0572] text-white"
      style={{ scale, opacity }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={homebg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Content Section */}
      <motion.div
        className="relative bg-white/20 backdrop-blur-lg p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-[#333333]">
          Bespoke Health
        </h1>
        <p className="text-lg md:text-2xl font-medium mt-3 text-[#333333]">
          Effortless healthcare appointments <br /> with AI-powered insights
        </p>
        <motion.button
          className="mt-6 px-6 py-3 bg-white text-[#333333] text-lg font-bold rounded-md hover:bg-[#FF6B6B]/80 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToSection}
        >
          VIEW SERVICES
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default HomeHeroSection;
