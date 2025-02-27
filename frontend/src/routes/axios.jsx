import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptors for logging requests and responses
api.interceptors.request.use(
  (config) => {
    console.log("[Axios] Request Sent:", config);
    return config;
  },
  (error) => {
    console.error("[Axios] Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Axios] API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default api;
