import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../routes/axios";
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

  // Fetch departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        // Assuming the API returns an array of departments
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
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
    const { name } = e.target;
    if (name === "profile_picture") {
      setProfilePicture(e.target.files[0]);
    } else if (name === "degree_certificate") {
      setDegreeCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("name", formData.name);
      data.append("department_id", formData.department_id);
      data.append("experience", formData.experience);
      data.append("phonenumber", formData.phonenumber);
      data.append("address", formData.address);
      data.append("qualification", formData.qualification);

      if (profilePicture) {
        data.append("profile_picture", profilePicture);
      }
      if (degreeCertificate) {
        data.append("degree_certificate", degreeCertificate);
      }

      await api.post("/doctor/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Signup successful! Please log in.");
      navigate("/doctor/login");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "An error occurred. Please try again.";
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl border border-gray-300">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Doctor Signup
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* First Row: Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="doctor@example.com"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Second Row: Name & Department Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Dr. John Doe"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="department_id"
                className="block text-gray-700 mb-1"
              >
                Department
              </label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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

          {/* Third Row: Experience & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experience" className="block text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                placeholder="5"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.experience}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phonenumber" className="block text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phonenumber"
                name="phonenumber"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.phonenumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Fourth Row: Address & Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="123 Medical Lane"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="qualification"
                className="block text-gray-700 mb-1"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                placeholder="MD, MBBS, etc."
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* File Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <label htmlFor="profile_picture" className="text-gray-700">
                Profile Picture
              </label>
              <label
                htmlFor="profile_picture"
                className="inline-block px-1 py-0.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 focus:ring transition"
              >
                {profilePicture ? profilePicture.name : "Browse"}
              </label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </div>
            {/* Degree Certificate */}
            <div className="flex items-center gap-4">
              <label htmlFor="degree_certificate" className="text-gray-700">
                Degree Certificate
              </label>
              <label
                htmlFor="degree_certificate"
                className="inline-block px-1 py-0.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 focus:ring transition"
              >
                {degreeCertificate ? degreeCertificate.name : "Browse"}
              </label>
              <input
                type="file"
                id="degree_certificate"
                name="degree_certificate"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-6"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/doctor/login"
            className="text-green-600 hover:underline"
            style={{ textDecoration: "none" }}
          >
            Log in here.
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DoctorSignup;
