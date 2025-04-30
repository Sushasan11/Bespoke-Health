import API from "../utils/axios";

class PatientService {
  
  async getDoctorPatients(page = 1, limit = 10, search = "") {
    try {
      let url = `/doctors/patients?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor's patients:", error);
      throw error;
    }
  }

  
  async getPatientDetails(patientId) {
    try {
      const response = await API.get(`/doctors/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient details for ID ${patientId}:`, error);
      throw error;
    }
  }
}

export default new PatientService();