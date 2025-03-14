import api from "./axios";

// Fetch all doctors
export const getDoctors = async () => {
  try {
    const response = await api.get("/doctors");
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

// Fetch a doctor by ID
export const getDoctorById = async (doctorId) => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor ${doctorId}:`, error);
    return null;
  }
};

// Fetch doctors by department
export const getDoctorsByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}/doctors`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching doctors for department ${departmentId}:`,
      error
    );
    return [];
  }
};

// Book an appointment with a doctor
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId, data) => {
  try {
    const response = await api.put(`/doctors/${doctorId}/profile`, data, {
      withCredentials: true, // Ensures only logged-in doctor can update
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating doctor ${doctorId}:`, error);
    throw error;
  }
};

// Delete doctor profile
export const deleteDoctorAccount = async (doctorId) => {
  try {
    const response = await api.delete(`/doctors/${doctorId}/delete`, {
      withCredentials: true, // Ensures only logged-in doctor can delete
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting doctor ${doctorId}:`, error);
    throw error;
  }
};
