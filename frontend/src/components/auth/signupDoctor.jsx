import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";

const SignupDoctor = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    specialization: "",
    experience: "",
    phonenumber: "",
    address: "",
    qualification: "",
    degree: null,
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phonenumber)) {
      newErrors.phonenumber = "Enter a valid 10-digit phone number";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    } else if (parseInt(formData.experience, 10) < 0) {
      newErrors.experience = "Experience cannot be negative";
    }

    ["name", "specialization", "address", "qualification"].forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (!formData.degree) {
      newErrors.degree = "Degree certificate is required";
    } else if (formData.degree.type !== "application/pdf") {
      newErrors.degree = "Degree must be a PDF file";
    } else if (formData.degree.size > 5 * 1024 * 1024) {
      newErrors.degree = "File size should not exceed 5MB";
    }

    if (!formData.profile_picture) {
      newErrors.profile_picture = "Profile picture is required";
    } else if (
      !["image/png", "image/jpeg"].includes(formData.profile_picture.type)
    ) {
      newErrors.profile_picture = "Profile picture must be PNG or JPEG";
    } else if (formData.profile_picture.size > 5 * 1024 * 1024) {
      newErrors.profile_picture = "File size should not exceed 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle file uploads
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiErrors([]);
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "experience") {
          formDataToSend.append(key, parseInt(value, 10));
        } else if (value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else {
          formDataToSend.append(key, value);
        }
      });

      console.log("Submitting FormData:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post("/signup/doctor", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Signup successful! Please wait for KYC verification.");

      // Delay before redirecting to login page
      setTimeout(() => {
        navigate("/login/doctor");
      }, 3000);
    } catch (error) {
      console.error("API Error:", error.response?.data);
      setApiErrors(
        error.response?.data?.detail || ["Signup failed. Please try again."]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Doctor Signup</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
        )}

        {/* API Errors */}
        {apiErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {apiErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              {["email", "password", "name", "specialization"].map((field) => (
                <div className="mb-3" key={field}>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    className={`form-control ${
                      errors[field] ? "is-invalid" : ""
                    }`}
                    placeholder={`Enter your ${field}`}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                  />
                  {errors[field] && (
                    <div className="invalid-feedback">{errors[field]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="col-md-6">
              {["experience", "phonenumber", "address", "qualification"].map(
                (field) => (
                  <div className="mb-3" key={field}>
                    <input
                      type={field === "experience" ? "number" : "text"}
                      name={field}
                      className={`form-control ${
                        errors[field] ? "is-invalid" : ""
                      }`}
                      placeholder={`Enter ${field}`}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                    {errors[field] && (
                      <div className="invalid-feedback">{errors[field]}</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="row">
            {[
              {
                name: "degree",
                label: "Upload Degree Certificate",
                accept: ".pdf",
              },
              {
                name: "profile_picture",
                label: "Upload Profile Picture",
                accept: ".png,.jpg,.jpeg",
              },
            ].map(({ name, label, accept }) => (
              <div className="col-md-6 mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input
                  type="file"
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  accept={accept}
                  onChange={(e) => handleFileChange(e, name)}
                  required
                />
                {errors[name] && (
                  <div className="invalid-feedback">{errors[name]}</div>
                )}
                <small className="text-muted">Max file size: 5MB</small>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupDoctor;
