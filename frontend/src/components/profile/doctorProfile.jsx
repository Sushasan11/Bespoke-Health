import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import "../../styles/doctorProfileCSS.css";

function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("/doctor/me/");
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>
      {doctor?.profile_picture && (
        <img
          src={`data:image/jpeg;base64,${doctor.profile_picture}`}
          alt="Profile"
          className="profile-pic"
        />
      )}
      <p>
        <strong>Name:</strong> {doctor?.name || "Not provided"}
      </p>
      <p>
        <strong>Specialization:</strong>{" "}
        {doctor?.specialization || "Not provided"}
      </p>
      <p>
        <strong>Experience:</strong> {doctor?.experience || "Not provided"}{" "}
        years
      </p>
      <p>
        <strong>Phone:</strong> {doctor?.phonenumber || "Not provided"}
      </p>
      <p>
        <strong>Address:</strong> {doctor?.address || "Not provided"}
      </p>
      <p>
        <strong>Qualification:</strong>{" "}
        {doctor?.qualification || "Not provided"}
      </p>
      <p>
        <strong>Email:</strong> {doctor?.email}
      </p>

      <button
        onClick={() => navigate("/doctor/update-profile")}
        className="update-button"
      >
        Update Profile
      </button>
    </div>
  );
}

export default DoctorProfile;
