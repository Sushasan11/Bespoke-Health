import { motion } from "framer-motion";

export default function PatientAIPrediction() {
  const aiFeatures = [
    "Heart Disease",
    "Diabetes",
    "Skin Issues",
    "Mental Health",
  ];

  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        AI Health Prediction
      </h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 mt-6"
        whileHover={{ scale: 1.02 }}
      >
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold">{feature}</h3>
            <p className="text-gray-600 mt-2">Get AI-based early detection</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
