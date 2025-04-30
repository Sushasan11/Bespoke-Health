
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardLayout from "../components/layouts/DashboardLayout";
import API from "../utils/axios";

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/medicines/${id}`);
        setMedicine(response.data);
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        setError("Failed to load medicine details");
        toast.error("Failed to load medicine details");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  
  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    return Math.round(((original - discounted) / original) * 100);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !medicine) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-base font-medium text-gray-900">
              Medicine not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error ||
                "The medicine you're looking for doesn't exist or has been removed."}
            </p>
            <div className="mt-6">
              <Link
                to="/dashboard/medicines"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go back to medicines
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to medicines
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-100">
              {medicine.image_url ? (
                <img
                  src={medicine.image_url.replace("/uploads/", "/api/uploads/")}
                  alt={medicine.name}
                  className="w-full h-full object-cover md:h-96"
                />
              ) : (
                <div className="w-full h-64 md:h-96 flex items-center justify-center bg-indigo-50">
                  <svg
                    className="h-24 w-24 text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.364 12.364a9 9 0 1 1-12.728-12.728 9 9 0 0 1 12.728 12.728Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8v4l3 3"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {medicine.name}
                  </h1>
                  <p className="text-gray-500">{medicine.manufacturer}</p>
                </div>

                <div className="flex flex-col items-end">
                  {medicine.prescription_required && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
                      Prescription Required
                    </span>
                  )}

                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                      medicine.in_stock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {medicine.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center mb-4">
                  {medicine.discount_price ? (
                    <>
                      <span className="text-3xl font-bold text-indigo-600">
                        Rs. {medicine.discount_price}
                      </span>
                      <span className="ml-3 text-lg text-gray-500 line-through">
                        Rs. {medicine.price}
                      </span>
                      <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {calculateDiscount(
                          medicine.price,
                          medicine.discount_price
                        )}
                        % OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-indigo-600">
                      Rs. {medicine.price}
                    </span>
                  )}
                </div>

                {medicine.category && (
                  <div className="mb-4">
                    <span className="text-gray-600">Category:</span>{" "}
                    <span className="font-medium">{medicine.category}</span>
                  </div>
                )}

                {medicine.quantity > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-600">Available:</span>{" "}
                    <span className="font-medium">
                      {medicine.quantity} units
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600">
                    {medicine.description ||
                      "No description available for this medicine."}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">
                          Important Information
                        </h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            Medicines should be taken only as prescribed by a
                            healthcare professional.
                            {medicine.prescription_required &&
                              " This medicine requires a prescription from a licensed healthcare provider."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicineDetailPage;
