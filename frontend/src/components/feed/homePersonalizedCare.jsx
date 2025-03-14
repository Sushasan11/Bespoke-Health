import { useState } from "react";
import { motion } from "framer-motion";
import aibg from "../../assets/aibg.png";
import dabbg from "../../assets/dabbg.png";
import medicalbg from "../../assets/medicalbg.png";
import HomePopup from "../modal/homePopup";

function HomePersonalizedCare() {
  // State to track which modal is open
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: "AI Disease Prediction",
      description:
        "Leverage advanced AI technology to predict potential diseases before they manifest.",
      img: aibg,
      details: `Empower your health with our cutting-edge AI Disease Prediction service. Utilizing sophisticated algorithms, 
      we analyze your medical history and lifestyle factors to forecast potential health issues. This proactive approach 
      allows for early intervention, leading to better health outcomes. By identifying risks before they develop into 
      serious conditions, you can take control of your wellness journey. Our AI-driven insights provide you with 
      personalized recommendations tailored to your unique health needs. Stay one step ahead and invest in your 
      health with our innovative predictive technology.`,
    },
    {
      title: "Direct Appointment Booking",
      description:
        "Simplify the process of scheduling appointments with healthcare professionals.",
      img: dabbg,
      details: `Experience seamless healthcare access with our Direct Appointment Booking system. Our platform connects 
      you directly with qualified doctors, eliminating the hassle of traditional appointment scheduling. Choose your 
      preferred healthcare professional, select a convenient time, and confirm your visit in just a few clicks. This 
      user-friendly system enhances the patient experience, ensuring that you receive the care you need without 
      unnecessary delays. Say goodbye to long wait times and complicated processes. Take charge of your health by 
      booking appointments with ease and confidence.`,
    },
    {
      title: "Medical Store",
      description:
        "Order prescribed medicines and healthcare products online with ease.",
      img: medicalbg,
      details: `Access a wide range of medicines and healthcare products through our Medical Store. Our online platform 
      allows you to order doctor-prescribed medicines conveniently and securely. Simply upload your prescription, 
      choose your required medicines, and get them delivered to your doorstep. Stay stocked up on essential healthcare 
      products and manage your medications effortlessly. Ensuring your well-being has never been this easy!`,
    },
  ];

  return (
    <div className="bg-[#F4F6F6] p-12">
      {/* Header Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[#6A0572] font-bold uppercase text-sm">
          Personalized Care
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mt-2">
          Connect with Doctors Seamlessly
        </h2>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedService(service)}
          >
            <img
              src={service.img}
              alt={service.title}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#333333]">
                {service.title}
              </h3>
              <p className="text-[#6A0572] mt-2">{service.description}</p>
              {/* Learn More Button */}
              <motion.span
                className="text-[#FF6B6B] font-semibold mt-4 inline-block hover:underline cursor-pointer"
                onClick={() => setSelectedService(service)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Popup Component */}
      {selectedService && (
        <HomePopup
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

export default HomePersonalizedCare;
