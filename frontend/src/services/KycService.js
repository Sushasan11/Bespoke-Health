import API from "../utils/axios";


export const submitKYC = async (data) => {
  try {
    
    const formData = new FormData();

    
    formData.append("citizenship_front", data.citizenship_front_file);
    formData.append("citizenship_back", data.citizenship_back_file);

    
    formData.append(
      "permanent_address",
      JSON.stringify(data.permanent_address)
    );

    if (data.temporary_address) {
      formData.append(
        "temporary_address",
        JSON.stringify(data.temporary_address)
      );
    }

    
    const response = await API.post("/kyc/submit", formData);
    
    return response.data;
  } catch (error) {
    console.error("KYC submission error:", error);
    
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Network error, please try again" };
    }
  }
};


export const getKYCStatus = async () => {
  try {
    const response = await API.get("/kyc/status");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: "Not Submitted" };
    }
    throw error.response?.data || { error: "Failed to retrieve KYC status" };
  }
};


export const getKYCsForReview = async (
  page = 1,
  limit = 10,
  status = "In-Review"
) => {
  try {
    const response = await API.get(
      `/kyc/review?page=${page}&limit=${limit}&status=${status}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to retrieve KYCs for review" }
    );
  }
};


export const reviewKYC = async (kycId, reviewData) => {
  try {
    const response = await API.put(`/kyc/review/${kycId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update KYC status" };
  }
};

export const getMyProfile = async ()=>{
  try{
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to retrieve profile" };
  }
}