import API from "../utils/axios";

class DiseasePredictionService {
  
  async getAllSymptoms() {
    try {
      const response = await API.get("/disease/symptoms");
      return response.data;
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      throw error.response?.data || { error: "Failed to fetch symptoms" };
    }
  }

  
  async predictDisease(symptoms) {
    try {
      const response = await API.post("/disease/predict-anonymous", { symptoms });
      return response.data;
    } catch (error) {
      console.error("Error predicting disease:", error);
      throw error.response?.data || { error: "Failed to predict disease" };
    }
  }
}

export default new DiseasePredictionService();