import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import DashboardRouter from "./components/routers/DashboardRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CustomersPage from "./pages/admin/CustomersPage";
import DoctorsManagementPage from "./pages/admin/DoctorsManagementPage";
import KYCRequestsPage from "./pages/admin/KYCRequestsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import SystemAnalyticsPage from "./pages/admin/SystemAnalyticsPage";
import AppointmentConfirmPage from "./pages/appointment/AppointmentConfirmPage";
import TimeSlotSelectionPage from "./pages/appointment/TimeSlotSelectionPage";
import BookAppointmentPage from "./pages/appointments/BookAppointmentPage";
import MyAppointmentsPage from "./pages/appointments/MyAppointmentsPage";
import InboxPage from "./pages/common/InboxPage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import DoctorConsultationsPage from "./pages/doctor/DoctorConsultationsPage";
import DoctorPatientsPage from "./pages/doctor/DoctorPatientsPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import MyAvailabilityPage from "./pages/doctor/MyAvailabilityPage";
import PatientDetailPage from "./pages/doctor/PatientDetailPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import KYCSubmissionPage from "./pages/KYCSubmissionPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import DiseasePredictionPage from "./pages/patient/DiseasePredictionPage";
import PatientPrescriptionsPage from "./pages/patient/PatientPrescriptionsPage";
import PaymentCallbackPage from "./pages/payment/PaymentCallbackPage";
import PaymentPage from "./pages/payment/PaymentPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import MedicineDetailPage from "./pages/MedicineDetailPage";
import MedicineStorePage from "./pages/MedicineStorePage";
import MedicineManagementPage from "./pages/admin/MedicineManagementPage";
import ChatPage from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/ChatContext";





// import socketService from './services/SocketService';


// const SocketInitializer = () => {
//   const { isAuthenticated, user } = useAuth();

//   useEffect(() => {
//     // Initialize socket when user is authenticated
//     if (isAuthenticated && user) {
//       socketService.init();
//     } else {
//       socketService.disconnect();
//     }


//     return () => {
//       socketService.disconnect();
//     };
//   }, [isAuthenticated, user]);

//   return null;
// };


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
        
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/kyc-verification" element={<KYCSubmissionPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />

          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment/book/:doctorId"
            element={
              <ProtectedRoute>
                <TimeSlotSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointment/confirm/:doctorId"
            element={
              <ProtectedRoute>
                <AppointmentConfirmPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment/success"
            element={
              <ProtectedRoute>
                <PaymentCallbackPage />
              </ProtectedRoute>
            }
          />
          <Route
  path="/dashboard/medicines"
  element={
    <ProtectedRoute>
      <MedicineStorePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/medicine/:id"
  element={
    <ProtectedRoute>
      <MedicineDetailPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/chat"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/admin/medicines"
  element={
    <ProtectedRoute>
      <MedicineManagementPage />
    </ProtectedRoute>
  }
/>
       
          <Route
            path="/appointment/book/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route path="/payment-callback" element={<PaymentCallbackPage />} />

          <Route
            path="/dashboard/appointments"
            element={
              <ProtectedRoute>
                <MyAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/prescriptions"
            element={
              <ProtectedRoute>
                <PatientPrescriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/disease-prediction"
            element={
              <ProtectedRoute>
                <DiseasePredictionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/kyc-requests"
            element={
              <ProtectedRoute>
                <KYCRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/doctors"
            element={
              <ProtectedRoute>
                <DoctorsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <SystemAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/availability"
            element={
              <ProtectedRoute>
                <MyAvailabilityPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/schedule"
            element={
              <ProtectedRoute>
                <DoctorSchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/patients"
            element={
              <ProtectedRoute>
                <DoctorPatientsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/consultations"
            element={
              <ProtectedRoute>
                <DoctorConsultationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/patients/:patientId"
            element={
              <ProtectedRoute>
                <PatientDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/inbox/:conversationId"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ChatProvider >
      </AuthProvider>
    </Router>
  );
}

export default App;
