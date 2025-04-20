function DoctorFooter() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-lg font-semibold">Bespoke Health</p>
        <p className="text-sm">
          Providing quality healthcare services for a better future.
        </p>
        <div className="flex justify-center space-x-4 mt-3">
          <a href="#" className="hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-400">
            Contact Us
          </a>
        </div>
        <p className="text-xs mt-3">
          &copy; {new Date().getFullYear()} Bespoke Health. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default DoctorFooter;
