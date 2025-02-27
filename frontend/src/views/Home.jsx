import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaCalendarCheck,
  FaLock,
  FaFileAlt,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <FaHeartbeat className="text-2xl text-red-500" />
          <span className="text-xl font-bold">Bespoke Health</span>
        </div>

        <div className="space-x-6 flex items-center">
          {/* Login Link with Hover Underline Animation */}
          <Link
            to="/patient/login"
            className="relative no-underline text-white hover:text-white transition group"
            style={{ textDecoration: "none" }}
          >
            Login
            {/* Animated underline using pseudo-element */}
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/patient/signup"
            className="hover:text-gray-300 no-underline"
            style={{ textDecoration: "none" }}
          >
            Patient Signup
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome, your health is our priority
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Join our community for personalized care and secure communication.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/patient/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition no-underline"
            style={{ textDecoration: "none" }}
          >
            Join as Patient
          </Link>
          <Link
            to="/doctor/signup"
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition no-underline"
            style={{ textDecoration: "none" }}
          >
            Join as Doctor
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <FaCalendarCheck className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Appointment</h3>
              <p className="text-center text-gray-600">
                Book appointments with ease using our intuitive scheduling
                system.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <FaLock className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Secure Communication
              </h3>
              <p className="text-center text-gray-600">
                Communicate safely with your doctor through encrypted channels.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
              <FaFileAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Records</h3>
              <p className="text-center text-gray-600">
                Access your medical history and records anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-2">
          <Link
            to="/doctor/login"
            className="px-5 py-2 bg-green-600 rounded-full hover:bg-green-700 transition no-underline text-white"
            style={{ textDecoration: "none" }}
          >
            Save life as Doctor
          </Link>
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} Bespoke Health. All rights
            reserved.
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Home;
