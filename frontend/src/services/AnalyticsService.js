
import API from "../utils/axios";

class AnalyticsService {
  
  async getAnalyticsOverview() {
    try {
      const response = await API.get("/analytics/overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      throw error.response?.data || { error: "Failed to fetch analytics overview" };
    }
  }

  
  async getUserAnalytics() {
    try {
      const response = await API.get("/analytics/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      throw error.response?.data || { error: "Failed to fetch user analytics" };
    }
  }

  
  async getDoctorAnalytics() {
    try {
      const response = await API.get("/analytics/doctors");
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor analytics:", error);
      throw error.response?.data || { error: "Failed to fetch doctor analytics" };
    }
  }

  
  async getPatientAnalytics() {
    try {
      const response = await API.get("/analytics/patients");
      return response.data;
    } catch (error) {
      console.error("Error fetching patient analytics:", error);
      throw error.response?.data || { error: "Failed to fetch patient analytics" };
    }
  }

  
  async getAppointmentAnalytics() {
    try {
      const response = await API.get("/analytics/appointments");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment analytics:", error);
      throw error.response?.data || { error: "Failed to fetch appointment analytics" };
    }
  }

  
  async getRevenueAnalytics() {
    try {
      const response = await API.get("/analytics/revenue");
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      throw error.response?.data || { error: "Failed to fetch revenue analytics" };
    }
  }

  
  async getOperationalMetrics() {
    try {
      const response = await API.get("/analytics/operations");
      return response.data;
    } catch (error) {
      console.error("Error fetching operational metrics:", error);
      throw error.response?.data || { error: "Failed to fetch operational metrics" };
    }
  }
}

export default new AnalyticsService();