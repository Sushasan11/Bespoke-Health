import { motion } from "framer-motion";
import HomeHeroSection from "../components/feed/homeHeroSection";
import HomeDetailedView from "../components/feed/homeDetailedView";
import HomePersonalizedCare from "../components/feed/homePersonalizedCare";
import HomeEffortlessAccess from "../components/feed/homeEffortlessAccess";
import HomeFooter from "../components/footer/homeFooter";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative">
        <HomeHeroSection />
      </div>

      {/* Detailed View Section */}
      <motion.div
        className="relative mt-8 z-10 bg-white"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <HomeDetailedView />
      </motion.div>

      {/* Personalized Care Section */}
      <motion.div
        id="personalized-care"
        className="relative mt-8 z-10 bg-white"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <HomePersonalizedCare />
      </motion.div>

      {/* Effortless Access Section */}
      <motion.div
        className="relative mt-8 z-10 bg-white"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <HomeEffortlessAccess />
      </motion.div>

      {/* Footer */}
      <HomeFooter />
    </motion.div>
  );
}

export default Home;
