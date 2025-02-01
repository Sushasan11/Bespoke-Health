import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../routes/axios";

function PatientHome() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    axios
      .get("/me/")
      .then((res) => {
        setUser(res.data);
        setName(res.data.name || "");
        setAge(res.data.age || "");
        setGender(res.data.gender || "");
        setAddress(res.data.address || "");
        setPhonenumber(res.data.phonenumber || "");
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Handle profile update
  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    try {
      await axios.put("/update-profile/", {
        name,
        age,
        gender,
        address,
        phonenumber,
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage("Profile update failed.");
      setError(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return loading ? (
    <p>Loading profile...</p>
  ) : (
    <div>
      <h2>Welcome, {user?.email}</h2>

      <form onSubmit={updateProfile}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <input
          type="text"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          placeholder="Phone"
        />
        <button type="submit">Update Profile</button>
      </form>

      {message && <p style={{ color: error ? "red" : "green" }}>{message}</p>}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default PatientHome;
