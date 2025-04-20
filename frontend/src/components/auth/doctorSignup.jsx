import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../routes/axios";
import { generateToken } from "../../context/firebase"; // 🔥 Firebase import
import "react-toastify/dist/ReactToastify.css";

function DoctorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department_id: "",
    experience: "",
    phonenumber: "",
    address: "",
    qualification: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data);
      } catch (error) {
        toast.error("Failed to load departments.");
      }
    };
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profile_picture") {
      setProfilePicture(files[0]);
    } else if (name === "degree_certificate") {
      setDegreeCertificate(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePicture) data.append("profile_picture", profilePicture);
      if (degreeCertificate)
        data.append("degree_certificate", degreeCertificate);

      await api.post("/doctor/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Signup successful! Redirecting to login...");

      // 🔥 Firebase token logic
      try {
        const token = await generateToken();
        if (token) {
          await api.post("/doctor/token", { token });
        }
      } catch (err) {
        console.error("FCM token error:", err);
      }

      setTimeout(() => navigate("/doctor/login"), 3000);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F6] p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-[#6A0572] mb-6">
          Doctor Signup
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333333] font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="doctor@example.com"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#333333] font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Name & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333333] font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Dr. Ram Shah"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#333333] font-medium">
                Department
              </label>
              <select
                name="department_id"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.department_id}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333333] font-medium">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                placeholder="5"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.experience}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#333333] font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phonenumber"
                placeholder="+977 9812345678"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.phonenumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Address & Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333333] font-medium">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Kathmandu, Nepal"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#333333] font-medium">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                placeholder="MD, MBBS"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6A0572] outline-none"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#333333] font-medium">
                Profile Picture
              </label>
              <label className="flex items-center justify-center px-4 py-2 bg-[#007bff] text-white rounded-md cursor-pointer hover:bg-[#0056b3] transition">
                Browse
                <input
                  type="file"
                  name="profile_picture"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </label>
              {profilePicture && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#333333] font-medium">
                Degree Certificate
              </label>
              <label className="flex items-center justify-center px-4 py-2 bg-[#007bff] text-white rounded-md cursor-pointer hover:bg-[#0056b3] transition">
                Browse
                <input
                  type="file"
                  name="degree_certificate"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  required
                />
              </label>

              {degreeCertificate && (
                <div className="mt-2 flex items-center gap-3 p-2 border border-gray-300 rounded-md bg-gray-100">
                  {degreeCertificate.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(degreeCertificate)}
                      alt="Certificate Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-md">
                        <span className="text-lg font-bold">PDF</span>
                      </div>
                      <span className="text-gray-700 text-sm">
                        {degreeCertificate.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#866bff] text-white py-2 rounded-md hover:bg-[#FF6B6B]/80 transition-all"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/doctor/login"
            className="text-[#6A0572] hover:underline font-medium"
          >
            Log in here.
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default DoctorSignup;
