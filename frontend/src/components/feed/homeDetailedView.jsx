import { motion } from "framer-motion";
import phbg from "../../assets/phbg.png";

function HomeDetailedView() {
  return (
    <motion.div
      className="relative z-20 bg-[#F4F6F6] p-16 min-h-screen flex flex-col md:flex-row items-center gap-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Left Section - Text */}
      <motion.div
        className="md:w-1/2 text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[#6A0572] font-semibold uppercase text-sm tracking-wide">
          Personalized Healthcare
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold text-[#333333] mt-3">
          Connecting Patients with Experts
        </h2>
        <p className="mt-4 text-[#333333] text-lg leading-relaxed">
          Bespoke Health revolutionizes the way you access medical care in
          Kathmandu, NP. Our innovative appointment booking system directly
          connects patients with qualified doctors, ensuring you receive the
          expert attention you need. Utilizing advanced AI technology, we
          predict potential diseases, allowing for proactive and personalized
          health management.
        </p>
      </motion.div>

      {/* Right Section - Image */}
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={phbg}
          alt="Healthcare"
          className="w-full rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
        />
      </motion.div>
    </motion.div>
  );
}

export default HomeDetailedView;
