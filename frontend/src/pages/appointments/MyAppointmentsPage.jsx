import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AppointmentService from "../../services/AppointmentService";
import ChatButton from "../../components/chat/ChatButton";

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const status =
          activeTab === "upcoming"
            ? "confirmed"
            : activeTab === "completed"
            ? "completed"
            : activeTab === "cancelled"
            ? "cancelled"
            : null;

        const data = await AppointmentService.getPatientAppointments(status);
        console.log("Raw API response:", data);

        
        const appointmentsData = Array.isArray(data)
          ? data
          : data.appointments || [];
        setAppointments(appointmentsData);

        console.log("Fetched appointments:", appointmentsData); 
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.error || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab]);

  
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  
  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedAppointment(null);
  };

  
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      setCancelLoading(true);
      await AppointmentService.cancelAppointment(
        selectedAppointment.id,
        cancelReason
      );

      
      setAppointments(
        appointments.map((app) =>
          app.id === selectedAppointment.id
            ? { ...app, status: "Cancelled" }
            : app
        )
      );

      toast.success("Appointment cancelled successfully");
      closeCancelModal();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.error || "Failed to cancel appointment");
    } finally {
      setCancelLoading(false);
    }
  };

  
  const formatTime = (timeString) => {
    try {
      const time = parseISO(`2000-01-01T${timeString}`);
      return format(time, "h:mm a");
    } catch (error) {
      return timeString;
    }
  };

  
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "EEEE, MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Appointments
        </h1>

        
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`${
                activeTab === "upcoming"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`${
                activeTab === "completed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`${
                activeTab === "cancelled"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Cancelled
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
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No {activeTab} appointments
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === "upcoming"
                ? "You don't have any upcoming appointments scheduled."
                : activeTab === "completed"
                ? "You haven't completed any appointments yet."
                : "You don't have any cancelled appointments."}
            </p>
            {activeTab === "upcoming" && (
              <Link
                to="/doctors"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Find a Doctor
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                          {appointment.doctor.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Dr. {appointment.doctor.name}
                          </h3>
                          <p className="text-sm text-blue-600">
                            {appointment.doctor.speciality}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(appointment.date)}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(appointment.start_time)} to{" "}
                        {formatTime(appointment.end_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-medium text-gray-900">
                        NPR {appointment.amount}
                      </p>
                      <p
                        className={`text-xs ${
                          appointment.payment_status === "completed"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {appointment.payment_status === "completed"
                          ? "Paid"
                          : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booked On</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(
                          new Date(appointment.created_at),
                          "MMMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  
                  {activeTab === "upcoming" && (
                    <div className="mt-5 flex flex-col sm:flex-row gap-2">
                      {appointment.status === "confirmed" && (
                        <>
                         <ChatButton
                            appointmentId={appointment.id}
                            className="mr-2"
                          />
                          <button
                            onClick={() => openCancelModal(appointment)}
                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-100 bg-red-700 hover:bg-red-500"
                          >
                            Cancel Appointment
                          </button>
                        </>
                      )}
                      {appointment.status === "pending" && (
                        <div className="text-sm text-yellow-700 bg-yellow-50 rounded-md py-2 px-3">
                          <p>
                            Payment pending. Your appointment will be confirmed
                            after payment.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  
                  {(appointment.symptoms || appointment.notes) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {appointment.symptoms && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Symptoms</p>
                          <p className="text-sm text-gray-700">
                            {appointment.symptoms}
                          </p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div>
                          <p className="text-xs text-gray-500">Notes</p>
                          <p className="text-sm text-gray-700">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {cancelModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeCancelModal}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Cancel Appointment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your appointment with
                        Dr. {selectedAppointment.doctor.name} on{" "}
                        {formatDate(selectedAppointment.date)} at{" "}
                        {formatTime(selectedAppointment.start_time)}?
                      </p>

                      <div className="mt-4">
                        <label
                          htmlFor="cancel_reason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reason for cancellation{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="cancel_reason"
                          name="cancel_reason"
                          rows="3"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Please provide a reason for cancellation"
                        ></textarea>
                      </div>

                      <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                        <p className="text-xs text-yellow-700">
                          <strong>Cancellation Policy:</strong> Appointments
                          cancelled less than 12 hours before the scheduled time
                          may be subject to cancellation fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Keep Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyAppointmentsPage;
