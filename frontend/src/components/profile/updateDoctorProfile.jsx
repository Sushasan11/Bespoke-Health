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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/doctor/update-profile", doctorData);
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
        />
        <input
          type="text"
          name="specialization"
          value={doctorData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
        />
        <input
          type="number"
          name="experience"
          value={doctorData.experience}
          onChange={handleChange}
          placeholder="Years of Experience"
        />
        <input
          type="text"
          name="phonenumber"
          value={doctorData.phonenumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          type="text"
          name="address"
          value={doctorData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="qualification"
          value={doctorData.qualification}
          onChange={handleChange}
          placeholder="Qualification"
        />
        <button type="submit" className="update-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdateDoctorProfile;
