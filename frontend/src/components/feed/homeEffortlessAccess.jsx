import { useState } from "react";
import { motion } from "framer-motion";
import abbg from "../../assets/abbg.png";
import aidpbg from "../../assets/aidpbg.png";
import HomePopupCarousel from "../modal/homePopupCarousel";

function HomeEffortlessAccess() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: "Appointment booking",
      description:
        "Effortlessly book your appointment with qualified doctors at Bespoke Health.",
      img: abbg,
      details:
        "Schedule an appointment with expert doctors in just a few clicks.",
    },
    {
      title: "AI disease prediction",
      description:
        "Utilize AI to predict potential health issues and stay ahead of your wellbeing.",
      img: aidpbg,
      details:
        "AI-powered predictions help you stay proactive about your health.",
    },
  ];

  return (
    <div className="bg-white px-6 md:px-16 py-16 mb-20">
      {/* Section Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-green-600 font-bold uppercase text-sm">
          Effortless Healthcare
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#333333]">
          Simplify Your Healthcare Journey
        </h2>
      </motion.div>

      {/* Cards Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="rounded-lg shadow-md overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setSelectedService({ service, index })}
            whileTap={{ scale: 0.95 }}
          >
            {/* Image */}
            <img
              src={service.img}
              alt={service.title}
              className="w-full h-[250px] object-cover"
            />

            {/* Text Section */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-[#333333]">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                {service.description}
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-black font-medium underline"
              >
                Learn more
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Popup Carousel */}
      {selectedService && (
        <HomePopupCarousel
          services={services}
          selectedIndex={selectedService.index}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

export default HomeEffortlessAccess;
