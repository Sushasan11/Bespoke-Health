import api from "./axios";

// Fetch all departments
export const getDepartments = async () => {
  try {
    const response = await api.get("/departments/");
    console.log("Departments Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error.response || error);
    return [];
  }
};
