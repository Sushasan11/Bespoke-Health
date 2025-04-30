import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getAllDoctors, getAllSpecialties } from "../../services/DoctorService";
import PatientService from "../../services/PatientService";
import DoctorBrowser from "../../components/home/DoctorBrowser";

const PatientDashboard = () => {
  const { user } = useAuth();
  const doctorBrowserRef = useRef(null);

  const scrollToDoctorBrowser = () => {
    doctorBrowserRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Patient"}!
          </h1>
          <p className="opacity-90 mb-4">
            Your health is our priority. Book appointments, consult with
            specialists, and manage your health journey all in one place.
          </p>
          <Link
            onClick={scrollToDoctorBrowser}
            className="inline-block px-4 py-2 bg-white text-blue-700 font-medium rounded-lg shadow hover:bg-blue-50 transition duration-150"
          >
            Book an Appointment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r  from-purple-500 to-indigo-600 rounded-xl shadow-md p-6 mb-6 text-white">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="font-bold text-lg">Health Record</h3>
            </div>
            <p className="mb-3 opacity-90">
              Store and manage all your medical documents in one secure place.
            </p>
            <Link
              to="/dashboard/prescriptions"
              className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-medium rounded hover:bg-opacity-30 transition duration-150"
            >
              Manage Records
            </Link>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-md p-6 mb-6 text-white">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="font-bold text-lg">Quick Assistance</h3>
            </div>
            <p className="mb-3 opacity-90">
              Need urgent medical advice? Connect with available doctors right
              now.
            </p>
            <Link
              to="/dashboard/appointments"
              className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-medium rounded hover:bg-opacity-30 transition duration-150"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div ref={doctorBrowserRef} className="mt-8">
          <DoctorBrowser />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
