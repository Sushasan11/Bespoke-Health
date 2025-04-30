import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Health, <span className="text-blue-600">Our Priority</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Access quality healthcare services from the comfort of your home. Connect with expert doctors and get personalized care when you need it most.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Get Started
              </Link>
              <Link
                to="/doctors"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-md border border-blue-200 hover:bg-blue-50 transition-colors text-center"
              >
                Find Doctors
              </Link>
            </div>
            <div className="mt-10 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-10 w-10 rounded-full border-2 border-white bg-${['blue', 'green', 'indigo', 'purple'][i-1]}-100 flex items-center justify-center text-${['blue', 'green', 'indigo', 'purple'][i-1]}-600 font-bold text-xs`}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-700">Trusted by</div>
                <div className="text-sm text-gray-500">10,000+ patients</div>
              </div>
            </div>
          </div>
          
          
          <div className="mt-10 md:mt-0 md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full filter blur-3xl opacity-30 transform translate-x-10 -translate-y-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Doctor with patient" 
                className="relative z-10 rounded-lg shadow-xl w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-lg shadow-lg p-4 z-20">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Verified Doctors</p>
                    <p className="text-xs text-gray-500">All doctors are verified professionals</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-white rounded-lg shadow-lg p-4 z-20">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                    <p className="text-xs text-gray-500">Get help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;