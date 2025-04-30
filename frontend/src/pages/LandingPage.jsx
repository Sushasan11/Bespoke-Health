import CallToAction from "../components/home/CallToAction";
import DoctorBrowser from "../components/home/DoctorBrowser";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Navbar from "../components/home/Navbar";
import Testimonials from "../components/home/Testimonials";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <DoctorBrowser />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
