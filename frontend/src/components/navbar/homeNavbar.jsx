import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../context/firebase";

function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      toast(payload.notification.body);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1A1A1A] shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo with Click Redirect */}
        <div
          className="text-lg md:text-xl font-bold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          BESPOKE HEALTH
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-6">
          <a
            href="/patient/signup"
            className="px-5 py-2 border border-[#FF6B6B] text-white text-sm rounded-md hover:bg-[#FF6B6B]/80 transition duration-300"
          >
            Signup
          </a>
          <a
            href="/patient/login"
            className="px-5 py-2 border border-[#FF6B6B] text-white text-sm rounded-md hover:bg-[#FF6B6B]/80 transition duration-300"
          >
            Login
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-2xl"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-gray-600 absolute top-full left-0 w-full">
          <ul className="flex flex-col items-center py-4 space-y-3">
            <li>
              <a
                href="/patient/signup"
                className="text-white text-lg hover:text-[#FF6B6B] transition duration-300"
              >
                Signup
              </a>
            </li>
            <li>
              <a
                href="/patient/login"
                className="text-white text-lg hover:text-[#FF6B6B] transition duration-300"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default HomeNavbar;
