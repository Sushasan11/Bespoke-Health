import React, { useState } from "react";
import axios from "../../routes/axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setMessage("Password changed successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
