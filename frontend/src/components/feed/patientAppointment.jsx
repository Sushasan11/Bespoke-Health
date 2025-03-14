import { motion } from "framer-motion";

export default function PatientAppointmentSteps() {
  const steps = [
    "Find a Doctor",
    "Book Appointment",
    "Pay Online",
    "Consult via Video",
    "Get Report",
  ];

  return (
    <section className="py-10 bg-blue-50">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold">{step}</h3>
            <p className="text-gray-600 mt-2">
              Easily navigate the healthcare process
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
