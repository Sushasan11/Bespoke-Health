import { FiFacebook, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";

function HomeFooter() {
  return (
    <footer className="bg-[#ffffff] text-gray py-10 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start text-center md:text-left px-6 ">
        {/* Logo Section */}
        <div className="flex-1 mb-6 md:mb-0">
          <h2 className="text-2xl font-extrabold">BESPOKE HEALTH</h2>
          <p className="mt-2 text-sm">
            Revolutionizing healthcare with AI-powered insights.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1 mb-6 md:mb-0 text-gray">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href="/doctor/signup"
                className="text-gray hover:text-[#FF6B6B] transition duration-300"
              >
                Signup as Doctor
              </a>
            </li>
            <li>
              <a
                href="/doctor/login"
                className=" hover:text-[#FF6B6B] transition duration-300"
              >
                Save Life as Doctor
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className=" hover:text-[#FF6B6B] transition duration-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex-1">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <ul className="mt-3 space-y-2">
            <li>📍 Kathmandu, Nepal</li>
            <li>✉️ bespokehealth@gmail.com</li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a
              href="#"
              className=" hover:text-[#FF6B6B] transition duration-300"
            >
              <FiFacebook size={20} />
            </a>
            <a
              href="#"
              className=" hover:text-[#FF6B6B] transition duration-300"
            >
              <FiTwitter size={20} />
            </a>
            <a
              href="#"
              className=" hover:text-[#FF6B6B] transition duration-300"
            >
              <FiInstagram size={20} />
            </a>
            <a
              href="mailto:bespokehealth@gmail.com"
              className=" hover:text-[#FF6B6B] transition duration-300"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center  text-sm mt-8 border-t border-gray-500 pt-4">
        © {new Date().getFullYear()} Bespoke Health. All rights reserved.
      </div>
    </footer>
  );
}

export default HomeFooter;
