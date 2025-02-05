import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../routes/axios";

function DoctorHome() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kycPending, setKycPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("/doctor/me/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setDoctor(response.data);
        setKycPending(!response.data.is_verified);

        if (!response.data.is_verified) {
          navigate("/doctor/kyc-warning");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        localStorage.removeItem("token");
        navigate("/login/doctor");
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
    <div className="doctor-home">
      {kycPending && (
        <div className="kyc-warning">
          <p>🚨 Please verify your KYC to access all features.</p>
          <a href="/doctor/update-profile">Update KYC</a>
        </div>
      )}
      <h2>Welcome, {doctor?.name || "Doctor"}!</h2>
      {doctor?.profile_picture && (
        <img
          src={`data:image/jpeg;base64,${doctor.profile_picture}`}
          alt="Profile"
          className="profile-pic"
        />
      )}
      <p>Specialization: {doctor?.specialization || "Not provided"}</p>
      <p>Email: {doctor?.email}</p>
    </div>
  );
}

export default DoctorHome;
