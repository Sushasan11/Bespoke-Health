import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DoctorDashboard from "../../pages/dashboards/DoctorDashboard";
import PatientDashboard from "../../pages/dashboards/PatientDashboard";
import AdminDashboard from "../../pages/dashboards/AdminDashboard";

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4"
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
          <p className="text-blue-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "Patient":
      return <PatientDashboard />;
    case "Doctor":
      return <DoctorDashboard />;
    case "Admin":
      return <AdminDashboard />;
    default:
      return <PatientDashboard />;
  }
};

export default DashboardRouter;
