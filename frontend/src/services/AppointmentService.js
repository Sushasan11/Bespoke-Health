import { format } from "date-fns";
import API from "../utils/axios";

class AppointmentService {
  
  async getDoctorSchedule(startDate, endDate) {
    try {
      let url = `/appointments/doctor/schedule?startDate=${format(
        startDate,
        "yyyy-MM-dd"
      )}`;

      if (endDate) {
        url += `&endDate=${format(endDate, "yyyy-MM-dd")}`;
      }

      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor schedule:", error);
      throw error;
    }
  }

  
  async getDoctorTimeSlots(doctorId, date) {
    try {
      const response = await API.get(
        `/appointments/doctors/${doctorId}/time-slots`,
        {
          params: { date },
        }
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Failed to fetch available time slots",
        }
      );
    }
  }

  
  async bookAppointment(appointmentData) {
    try {
      const response = await API.post("/appointments/book", appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to book appointment" };
    }
  }

  
  async getPatientAppointments(status) {
    try {
      const params = status ? { status } : {};
      const response = await API.get("/appointments/patient", { params });

      
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error.response?.data || { error: "Failed to fetch appointments" };
    }
  }

  
  async cancelAppointment(appointmentId, reason) {
    try {
      const response = await API.put(`/appointments/${appointmentId}/cancel`, {
        cancellation_reason: reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to cancel appointment" };
    }
  }
}

export default new AppointmentService();
