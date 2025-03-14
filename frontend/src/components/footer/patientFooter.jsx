import { FiFacebook, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";

export default function PatientFooter() {
  return (
    <footer className="bg-white text-gray py-10 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start text-center md:text-left px-6">
        <div className="flex-1 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold">Bespoke Health</h2>
          <p className="mt-2 text-sm">
            Bringing personalized healthcare solutions to you.
          </p>
        </div>

        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="/patient/appointments" className="hover:underline">
                Appointments
              </a>
            </li>
            <li>
              <a href="/patient/doctors" className="hover:underline">
                Find a Doctor
              </a>
            </li>
            <li>
              <a href="/patient/prediction" className="hover:underline">
                AI Prediction
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <ul className="mt-3 space-y-2">
            <li>📍 Kathmandu, Nepal</li>
            <li>✉️ bespokehealth@gmail.com</li>
          </ul>

          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a href="#" className="hover:text-gray-300 transition">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FiInstagram size={20} />
            </a>
            <a
              href="mailto:bespokehealth@gmail.com"
              className="hover:text-gray-300 transition"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-8 border-t border-gray-500 pt-4">
        © {new Date().getFullYear()} Bespoke Health. All rights reserved.
      </div>
    </footer>
  );
}
