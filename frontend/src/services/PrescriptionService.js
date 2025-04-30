import API from "../utils/axios";

class PrescriptionService {
  
  async getPatientPrescriptions(page = 1, limit = 10) {
    try {
      const response = await API.get(`/appointments/patient/prescriptions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      throw error.response?.data || { error: "Failed to fetch prescriptions" };
    }
  }

  
  async getPrescriptionById(prescriptionId) {
    try {
      const response = await API.get(`/appointments/${prescriptionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching prescription details:", error);
      throw error.response?.data || { error: "Failed to fetch prescription details" };
    }
  }
}

export default new PrescriptionService();