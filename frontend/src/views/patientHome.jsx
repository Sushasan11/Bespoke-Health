import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../routes/axios";
import { FaUserMd, FaHospital, FaStethoscope, FaRobot } from "react-icons/fa";
import "../styles/patientHomeCss.css";

function PatientHome() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch doctors and departments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, departmentsRes] = await Promise.all([
          axios.get("/doctors", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/departments", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setDoctors(doctorsRes.data);
        setDepartments(departmentsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          {/* Doctors Section */}
          <div className="mb-4">
            <h2 className="text-center">
              <FaUserMd className="me-2 text-primary" /> Our Doctors
            </h2>
            <div className="row">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor.id} className="col-md-4 mb-3">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5 className="card-title">{doctor.name}</h5>
                        <p className="card-text">
                          <FaStethoscope className="text-success" />{" "}
                          Specialization: {doctor.specialization}
                        </p>
                        <p className="card-text">
                          <FaHospital className="text-warning" /> Experience:{" "}
                          {doctor.experience} years
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No doctors available.</p>
              )}
            </div>
          </div>

          {/* Departments Section */}
          <div className="mb-4">
            <h2 className="text-center">
              <FaHospital className="me-2 text-danger" /> Departments
            </h2>
            <div className="row">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <div key={dept.id} className="col-md-4 mb-3">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5 className="card-title">{dept.name}</h5>
                        <p className="card-text">{dept.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">
                  No departments available.
                </p>
              )}
            </div>
          </div>

          {/* Predict Disease Section */}
          <div className="text-center mt-4">
            <h2>
              <FaRobot className="me-2 text-info" /> Predict Disease
            </h2>
            <p>Use our AI-based tool to predict diseases based on symptoms.</p>
            <button
              onClick={() => navigate("/predict-disease")}
              className="btn btn-lg btn-primary"
            >
              <FaRobot className="me-2" /> Predict Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PatientHome;
