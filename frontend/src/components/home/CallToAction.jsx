import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take control of your healthcare journey?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have simplified their healthcare experience with Bespoke Health. 
            Sign up today and connect with top healthcare professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-md hover:bg-blue-50 transition-colors text-center"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-md border-2 border-white hover:bg-blue-700 transition-colors text-center"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;