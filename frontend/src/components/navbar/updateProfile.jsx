import React, { useState, useEffect } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/updateProfileCss.css"; // Importing CSS

function UpdateProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phonenumber: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current patient data
    axios
      .get("/me/")
      .then((res) => setProfile(res.data))
      .catch(() => {
        setMessage("Failed to load profile.");
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));

    // Fetch address suggestions from OpenStreetMap API
    if (name === "address" && value.length > 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setAddressSuggestions(data);
        })
        .catch(() => setAddressSuggestions([]));
    }
  };

  const handleAddressSelect = (address) => {
    setProfile((prevProfile) => ({ ...prevProfile, address }));
    setAddressSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.put("/update-profile/", profile);
      if (response.status === 200) {
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate("/patient/dashboard"); // Redirect after success
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form className="update-profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="age"
          value={profile.age}
          onChange={handleChange}
          placeholder="Age"
        />

        {/* Gender Dropdown */}
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* OpenStreetMap Address Autocomplete */}
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Enter Address"
        />
        {addressSuggestions.length > 0 && (
          <ul className="address-suggestions">
            {addressSuggestions.map((addr, index) => (
              <li
                key={index}
                onClick={() => handleAddressSelect(addr.display_name)}
              >
                {addr.display_name}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          name="phonenumber"
          value={profile.phonenumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && (
        <p
          className={
            message.includes("successfully")
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UpdateProfile;
