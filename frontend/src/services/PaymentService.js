import API from "../utils/axios";


export const initiateKhaltiPayment = async (paymentId) => {
  try {
    const response = await API.post(`/payments/${paymentId}/khalti/initiate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to initiate payment" };
  }
};


export const verifyKhaltiPayment = async (pidx, transactionId) => {
  try {
    const response = await API.post("/payments/khalti/verify", {
      pidx,
      transaction_id: transactionId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to verify payment" };
  }
};