import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChatButton from "../../components/chat/ChatButton";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import AppointmentService from "../../services/AppointmentService";
const PatientAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const [cancellationReason, setCancellationReason] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        let statusParam;
        if (selectedStatus === "upcoming") {
          statusParam = "confirmed"; 
        } else if (selectedStatus === "all") {
          statusParam = null; 
        } else {
          statusParam = selectedStatus; 
        }

        const data = await AppointmentService.getPatientAppointments(
          statusParam
        );
        console.log("Param", { statusParam });
        console.log("Appointments data:", data);
        setAppointments(data.appointments || []);
      } catch (error) {
        toast.error(error.error || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedStatus]);

  
  const formatDateTime = (dateStr, timeStr) => {
    try {
      const date = parseISO(dateStr);
      const formattedDate = format(date, "MMMM d, yyyy");

      
      let formattedTime = "";
      if (timeStr) {
        const time = parseISO(`2000-01-01T${timeStr}`);
        formattedTime = format(time, "h:mm a");
      }

      return { formattedDate, formattedTime };
    } catch (error) {
      return { formattedDate: dateStr, formattedTime: timeStr };
    }
  };

  
  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelModalOpen(true);
  };

  
  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setAppointmentToCancel(null);
    setCancellationReason("");
  };

  
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      setCancelLoading(true);
      await AppointmentService.cancelAppointment(
        appointmentToCancel.id,
        cancellationReason
      );

      
      setAppointments(
        appointments.filter((app) => app.id !== appointmentToCancel.id)
      );

      toast.success("Appointment cancelled successfully");
      closeCancelModal();
    } catch (error) {
      toast.error(error.error || "Failed to cancel appointment");
    } finally {
      setCancelLoading(false);
    }
  };

  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800"> Appointments</h1>

          <div className="mt-4 md:mt-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Past</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No appointments found
            </h3>
            <p className="mt-1 text-gray-500">
              {selectedStatus === "upcoming"
                ? "You don't have any upcoming appointments."
                : selectedStatus === "completed"
                ? "You don't have any past appointments."
                : selectedStatus === "cancelled"
                ? "You don't have any cancelled appointments."
                : "You don't have any appointments."}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const { formattedDate, formattedTime } = formatDateTime(
                  appointment.date,
                  appointment.start_time
                );

                return (
                  <li key={appointment.id} className="p-6">
                    <div className="md:flex md:justify-between md:items-center">
                      <div className="md:flex md:items-center md:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                            {appointment.doctor_name.charAt(0)}
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            Dr. {appointment.doctor_name}
                          </h3>
                          <p className="text-sm text-blue-600">
                            {appointment.doctor_speciality}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:text-right">
                        <div className="flex md:justify-end space-x-2 mb-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.payment_status && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                                appointment.payment_status
                              )}`}
                            >
                              {appointment.payment_status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {formattedDate} • {formattedTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Appointment Type</p>
                          <p className="font-medium text-gray-900">
                            {appointment.consultation_type}
                          </p>
                        </div>

                        {appointment.fee && (
                          <div>
                            <p className="text-gray-500">Fee</p>
                            <p className="font-medium text-gray-900">
                              {appointment.fee.currency}{" "}
                              {appointment.fee.amount}
                            </p>
                          </div>
                        )}

                        {appointment.symptoms && (
                          <div>
                            <p className="text-gray-500">Symptoms</p>
                            <p className="font-medium text-gray-900">
                              {appointment.symptoms}
                            </p>
                          </div>
                        )}
                      </div>

                      {appointment.status === "confirmed" && (
                        <div className="mt-4 flex justify-end space-x-3">
                          <ChatButton
                            appointmentId={appointment.id}
                            className="mr-2"
                          />
                          
                          <button
                            onClick={() => openCancelModal(appointment)}
                            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                          >
                            Cancel 
                          </button>
                          
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cancel Appointment
              </h3>

              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your appointment with Dr.{" "}
                {appointmentToCancel?.doctor_name} on{" "}
                {formatDateTime(appointmentToCancel?.date).formattedDate}?
              </p>

              <div className="mb-4">
                <label
                  htmlFor="cancellationReason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for Cancellation
                </label>
                <textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleCancelAppointment}
                  disabled={!cancellationReason || cancelLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center"
                >
                  {cancelLoading ? (
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
                    "Cancel Appointment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientAppointmentsPage;
