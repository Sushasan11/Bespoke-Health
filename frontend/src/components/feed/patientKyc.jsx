import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFileUpload,
  FaSpinner,
} from "react-icons/fa";
import PatientNavbar from "../navbar/patientNavbar";
import api from "../../routes/axios";
import "react-toastify/dist/ReactToastify.css";

export default function PatientKYC() {
  const [kycStatus, setKycStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "",
    phonenumber: "",
    kyc_document: null,
  });

  // Fetch KYC Status
  useEffect(() => {
    async function fetchKycStatus() {
      try {
        const response = await api.get("/patient/kyc-status");
        setKycStatus(response.data.kyc_status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        toast.error("Failed to fetch KYC status. Try again later.");
      }
    }
    fetchKycStatus();
  }, []);

  // Handle Input Changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setFormData({ ...formData, kyc_document: e.target.files[0] });

  // Submit KYC Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]); // ✅ Ensure only non-null fields are sent
      }
    });

    try {
      const response = await api.put("/patient/submit-kyc", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ KYC submitted:", response.data);
      setKycStatus("submitted");
      toast.success("KYC submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting KYC:", error.response || error);
      toast.error(
        error.response?.data?.detail || "Failed to submit KYC. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PatientNavbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            KYC Verification
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Status:{" "}
            <span
              className={`font-semibold ${
                kycStatus === "approved"
                  ? "text-green-500"
                  : kycStatus === "submitted"
                  ? "text-blue-500"
                  : "text-yellow-500"
              }`}
            >
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </span>
          </p>

          {kycStatus === "approved" ? (
            <div className="text-center text-green-600 font-semibold">
              Your KYC is Verified! ✅
            </div>
          ) : kycStatus === "submitted" ? (
            <div className="text-center text-blue-600 font-semibold">
              Your KYC has already been submitted. 📄
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="pl-10 w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="pl-10 w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="pl-10 w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <FaFileUpload className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="file"
                  name="kyc_document"
                  onChange={handleFileChange}
                  className="pl-10 w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button with Loading Spinner */}
              <button
                type="submit"
                disabled={loading || kycStatus === "submitted"}
                className={`w-full py-3 px-4 ${
                  kycStatus === "submitted"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg flex items-center justify-center space-x-2`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaFileUpload />
                )}
                <span>{loading ? "Submitting..." : "Submit KYC"}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
