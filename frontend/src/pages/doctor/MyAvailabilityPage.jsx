import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getOwnAvailability,
  setDoctorAvailability,
  getOwnFees,
  setDoctorFees
} from "../../services/AvailabilityService";
import AvailabilityScheduler from "../../components/doctor/AvailabilityScheduler";
import ConsultationFeeManager from "../../components/doctor/ConsultationFeeManager";

const MyAvailabilityPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availabilities, setAvailabilities] = useState([]);
  const [fees, setFees] = useState([]);
  const [activeTab, setActiveTab] = useState("availability");

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        const [availabilityData, feesData] = await Promise.all([
          getOwnAvailability(),
          getOwnFees()
        ]);
        
        setAvailabilities(availabilityData);
        setFees(feesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const handleSaveAvailability = async (newAvailabilities) => {
    try {
      await setDoctorAvailability(newAvailabilities);
      setAvailabilities(newAvailabilities);
      toast.success("Availability saved successfully");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error(error.error || "Failed to save availability");
    }
  };

  
  const handleSaveFees = async (newFees) => {
    try {
      await setDoctorFees(newFees);
      setFees(newFees);
      toast.success("Consultation fees saved successfully");
    } catch (error) {
      console.error("Error saving fees:", error);
      toast.error(error.error || "Failed to save consultation fees");
    }
  };

  
  if (!loading && user?.role !== "Doctor") {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              This page is only accessible to doctors. Please contact support if you believe this is an error.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Availability & Fees
        </h1>

        
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("availability")}
              className={`${
                activeTab === "availability"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Availability Schedule
            </button>
            <button
              onClick={() => setActiveTab("fees")}
              className={`${
                activeTab === "fees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Consultation Fees
            </button>
          </nav>
        </div>

        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "availability" && (
              <AvailabilityScheduler
                availabilities={availabilities}
                onSave={handleSaveAvailability}
              />
            )}
            {activeTab === "fees" && (
              <ConsultationFeeManager 
                fees={fees} 
                onSave={handleSaveFees} 
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAvailabilityPage;