import API from "../utils/axios";

class ConsultationService {
  
  async getDoctorAppointments(filters = {}) {
    try {
      const { status, date, page = 1, limit = 10 } = filters;
      let url = `/appointments/doctor?page=${page}&limit=${limit}`;
      
      if (status) url += `&status=${status}`;
      if (date) url += `&date=${date}`;
      
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      throw error;
    }
  }

  
  async completeAppointment(appointmentId, notes) {
    try {
      const response = await API.patch(`/appointments/${appointmentId}/complete`, { notes });
      return response.data;
    } catch (error) {
      console.error("Error completing appointment:", error);
      throw error;
    }
  }

  
  async cancelAppointment(appointmentId, cancellationReason) {
    try {
      const response = await API.delete(`/appointments/${appointmentId}`, {
        data: { cancellation_reason: cancellationReason }
      });
      return response.data;
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error;
    }
  }

  
  async createOrUpdatePrescription(appointmentId, prescriptionData) {
    try {
      const response = await API.post(`/appointments/${appointmentId}/prescription`, prescriptionData);
      return response.data;
    } catch (error) {
      console.error("Error saving prescription:", error);
      throw error;
    }
  }

  
  async getPrescription(appointmentId) {
    try {
      const response = await API.get(`/appointments/${appointmentId}/prescription`);
      return response.data;
    } catch (error) {
      console.error("Error fetching prescription:", error);
      throw error;
    }
  }

  
  async getDoctorPrescriptions(page = 1, limit = 10, patientId) {
    try {
      let url = `/appointments/doctor/prescriptions?page=${page}&limit=${limit}`;
      if (patientId) url += `&patient_id=${patientId}`;
      
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor prescriptions:", error);
      throw error;
    }
  }

  
  async updateConsultationNotes(appointmentId, notes) {
    try {
      const response = await API.post(`/appointments/${appointmentId}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.error("Error updating consultation notes:", error);
      throw error;
    }
  }

  
  async getConsultationNotes(appointmentId) {
    try {
      const response = await API.get(`/appointments/${appointmentId}/notes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching consultation notes:", error);
      throw error;
    }
  }
}

export default new ConsultationService();