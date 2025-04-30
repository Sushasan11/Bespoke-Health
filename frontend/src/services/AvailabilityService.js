import API from "../utils/axios";


export const getDoctorAvailability = async (doctorId) => {
  try {
    const response = await API.get(`/doctors/${doctorId}/availability`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch availability" };
  }
};


export const getOwnAvailability = async () => {
  try {
    const response = await API.get("/availability/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch your availability" };
  }
};


export const setDoctorAvailability = async (availabilities) => {
  try {
    const response = await API.post("/availability/set", {
      availabilities,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to set availability" };
  }
};


export const getDoctorFees = async (doctorId) => {
  try {
    const response = await API.get(`/doctors/${doctorId}/fees`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch consultation fees" };
  }
};


export const getOwnFees = async () => {
  try {
    const response = await API.get("/availability/fees");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch your consultation fees" };
  }
};


export const setDoctorFees = async (fees) => {
  try {
    const response = await API.post("/availability/fees", {
      fees,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to set consultation fees" };
  }
};