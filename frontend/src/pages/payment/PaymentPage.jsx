import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { initiateKhaltiPayment } from "../../services/PaymentService";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { format, parseISO } from "date-fns";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  
  const {
    appointment_id,
    doctor_name,
    appointment_date,
    appointment_time,
    payment_amount,
    payment_id
  } = location.state || {};

  
  const storeTransactionInfo = (transactionId) => {
    localStorage.setItem("bspokehealth_transaction", JSON.stringify({
      appointment_id,
      transaction_id: transactionId,
      payment_id
    }));
  };

  
  const handleKhaltiPayment = async () => {
    try {
      setLoading(true);
      
      const response = await initiateKhaltiPayment(payment_id);
      
      
      storeTransactionInfo(response.transaction_id);
      
      
      window.location.href = response.payment_url;
      
    } catch (error) {
      toast.error(error.error || "Failed to initiate payment");
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!payment_id || !appointment_id) {
      toast.error("Missing payment information");
      navigate("/dashboard");
    }
  }, [payment_id, appointment_id, navigate]);

  
  const formatTime = (timeString) => {
    try {
      const time = parseISO(`2000-01-01T${timeString}`);
      return format(time, "h:mm a");
    } catch (error) {
      return timeString;
    }
  };

  if (!payment_id || !appointment_id) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-10">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            
            <div className="p-6 bg-blue-600 text-white">
              <h1 className="text-2xl font-bold">Complete Your Payment</h1>
              <p className="text-blue-100 mt-1">
                Secure your appointment by making a payment
              </p>
            </div>
            
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Appointment Summary
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium text-gray-800">Dr. {doctor_name}</span>
                  </div>
                  {appointment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-800">
                        {format(parseISO(appointment_date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {appointment_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-800">
                        {formatTime(appointment_time)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-lg text-blue-600">
                      NPR {payment_amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Select Payment Method
              </h2>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center">
                  <input
                    id="khalti"
                    name="payment_method"
                    type="radio"
                    checked={true}
                    readOnly
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="khalti" className="ml-3 flex items-center">
                    <img
                      src="https://khalti.com/static/images/khalti-logo.svg"
                      alt="Khalti"
                      className="h-8 mr-2"
                    />
                    <span className="text-gray-800">Pay with Khalti</span>
                  </label>
                </div>
              </div>
            </div>
            
            
            <div className="p-6 bg-gray-50">
              <div className="space-y-4">
                <button
                  onClick={handleKhaltiPayment}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-400 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Pay with Khalti"
                  )}
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  You'll be redirected to Khalti to complete your payment securely.
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Your payment is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;