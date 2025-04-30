import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { verifyKhaltiPayment } from "../../services/PaymentService";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("processing"); 
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);
        console.log("Verifying payment...");
        
        
        const searchParams = new URLSearchParams(location.search);
        const urlPidx = searchParams.get('pidx');
        
        
        const storedPidx = localStorage.getItem("khalti_pidx");
        const transactionId = localStorage.getItem("khalti_transaction_id");
        
        
        const pidx = urlPidx || storedPidx;
        
        if (!pidx || !transactionId) {
          console.error("Missing payment information", { pidx, transactionId });
          throw new Error("Missing payment information. Please try booking again.");
        }
        
        
        const response = await verifyKhaltiPayment(pidx, transactionId);
        console.log("Payment verification response:", response);
        
        if (response.success) {
          setStatus("success");
          setAppointmentDetails({
            id: response.appointment_id,
            date: response.appointment_date,
            time: response.appointment_time
          });
          toast.success("Payment successful! Your appointment is confirmed.");
        } else {
          setStatus("error");
          throw new Error(response.message || "Payment verification failed");
        }
        
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        toast.error(error.message || "Failed to verify payment");
      } finally {
        setLoading(false);
        
        
        localStorage.removeItem("khalti_pidx");
        localStorage.removeItem("khalti_transaction_id");
        localStorage.removeItem("appointment_id");
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  const handleViewAppointments = () => {
    navigate("/dashboard/appointments");
  };

  const handleTryAgain = () => {
    navigate("/doctors");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-10">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Verifying Payment
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we confirm your payment with Khalti...
                  </p>
                </div>
              ) : status === "success" ? (
                <div className="text-center py-8">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your appointment has been confirmed.
                  </p>
                  
                  {appointmentDetails && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-md text-left">
                      <p className="text-sm text-gray-500 mb-1">Appointment ID</p>
                      <p className="font-medium mb-2">{appointmentDetails.id}</p>
                      <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                      <p className="font-medium">{appointmentDetails.date} at {appointmentDetails.time}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleViewAppointments}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View My Appointments
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Payment Failed
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't verify your payment. Please try booking again.
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCallbackPage;