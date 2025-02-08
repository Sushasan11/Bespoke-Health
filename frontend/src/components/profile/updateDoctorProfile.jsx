import React, { useState, useEffect } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/doctorProfileCSS.css";

function UpdateDoctorProfile() {
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    experience: "",
    phonenumber: "",
    address: "",
    qualification: "",
    degree: null,
    profile_picture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("/doctor/me/");
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(doctorData).forEach((key) => {
      formData.append(key, doctorData[key]);
    });

    try {
      await axios.put("/doctor/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      navigate("/doctor/profile");
    } catch (error) {
      alert("Failed to update profile.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={doctorData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="specialization"
          value={doctorData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          required
        />
        <input
          type="number"
          name="experience"
          value={doctorData.experience}
          onChange={handleChange}
          placeholder="Years of Experience"
          required
        />
        <input
          type="text"
          name="phonenumber"
          value={doctorData.phonenumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="text"
          name="address"
          value={doctorData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="qualification"
          value={doctorData.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          required
        />
        <input type="file" name="degree" onChange={handleFileChange} required />
        <input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
          required
        />
        <button type="submit" className="update-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdateDoctorProfile;
