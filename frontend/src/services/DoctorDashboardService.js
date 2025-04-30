import API from "../utils/axios";

class DoctorDashboardService {
  
  async getGeneralStats() {
    try {
      const response = await API.get("/stats/doctor/general");
      return response.data;
    } catch (error) {
      console.error("Error fetching general stats:", error);
      throw error;
    }
  }

  
  async getAppointmentAnalytics() {
    try {
      const response = await API.get("/stats/doctor/appointments");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment analytics:", error);
      throw error;
    }
  }

  
  async getPatientInsights() {
    try {
      const response = await API.get("/stats/doctor/patients");
      return response.data;
    } catch (error) {
      console.error("Error fetching patient insights:", error);
      throw error;
    }
  }
}

export default new DoctorDashboardService();
