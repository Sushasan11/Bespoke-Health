import api from "./axios";

// Fetch all departments
export const getDepartments = async () => {
  try {
    const response = await api.get("/departments/");
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Fetch a department by ID
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${departmentId}:`, error);
    return null;
  }
};

// Create a new department
export const createDepartment = async (data) => {
  try {
    const response = await api.post("/departments/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

// Update a department
export const updateDepartment = async (departmentId, data) => {
  try {
    const response = await api.put(`/departments/${departmentId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${departmentId}:`, error);
    throw error;
  }
};

// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${departmentId}:`, error);
    throw error;
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
