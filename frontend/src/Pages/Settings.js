
import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {

  const navigate = useNavigate();

  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(null);


  // ==========================================
  // PASSWORD
  // ==========================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // ==========================================
  // MESSAGES
  // ==========================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [notifications, setNotifications] = useState(true);


  // ==========================================
  // GET USER
  // ==========================================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await api.get("/me");
if (res.data.success) {
  setUser(res.data.user);

  setNotifications(
    res.data.user.notificationsEnabled ?? true
  );
}

      } catch (err) {

        console.log(err);

      }

    };

    fetchUser();

  }, []);


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setError("Please fill all password fields");

      return;

    }


    if (newPassword.length < 7) {

      setError(
        "New password must be at least 7 characters"
      );

      return;

    }


    if (newPassword.length > 15) {

      setError(
        "New password must be at most 15 characters"
      );

      return;

    }


    if (newPassword !== confirmPassword) {

      setError(
        "New passwords do not match"
      );

      return;

    }


    try {

      setLoading(true);


      const res = await api.put(
        "/student/change-password",
        {
          currentPassword,
          newPassword
        }
      );


      if (res.data.success) {

        setMessage(
          res.data.message ||
          "Password changed successfully"
        );


        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      }

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Unable to change password"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {

    try {

      await api.get("/logout");

      navigate("/login");

    } catch (err) {

      console.log(err);

      navigate("/login");

    }

  };


  // ==========================================
  // NOTIFICATION TOGGLE
  // ==========================================

 const handleNotificationToggle = async () => {
  const newValue = !notifications;

  try {
    const res = await api.put(
      "/settings/notifications",
      {
        notificationsEnabled: newValue
      }
    );

    if (res.data.success) {
      setNotifications(newValue);
    }

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "Unable to update notification settings"
    );
  }
};

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="settings-container">

      <div className="settings-card">

        <div className="settings-header">

          <h1>Settings</h1>

          <p>
            Manage your account and preferences
          </p>

        </div>


        {/* ======================================
            ACCOUNT
        ====================================== */}

        <div className="settings-section">

          <h2>Account Information</h2>

          <div className="account-info">

            <div className="info-item">

              <span>Name</span>

              <strong>
                {user?.name || "Loading..."}
              </strong>

            </div>


            <div className="info-item">

              <span>Email</span>

              <strong>
                {user?.email || "Loading..."}
              </strong>

            </div>


            <div className="info-item">

              <span>Role</span>

              <strong>
                {user?.role || "Loading..."}
              </strong>

            </div>

          </div>

        </div>


        {/* ======================================
            SECURITY
        ====================================== */}

        <div className="settings-section">

          <h2>Security</h2>

          <p className="section-description">
            Change your account password.
          </p>


          <form onSubmit={handleChangePassword}>

            <div className="form-group">

              <label>
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
              />

            </div>


            <div className="form-group">

              <label>
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
              />

            </div>


            <div className="form-group">

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
              />

            </div>


            {error && (

              <p className="settings-error">
                {error}
              </p>

            )}


            {message && (

              <p className="settings-success">
                {message}
              </p>

            )}


            <button
              type="submit"
              className="change-password-btn"
              disabled={loading}
            >

              {loading
                ? "Changing Password..."
                : "Change Password"}

            </button>

          </form>

        </div>


        {/* ======================================
            NOTIFICATIONS
        ====================================== */}

        <div className="settings-section">

          <h2>Notifications</h2>

          <div className="setting-row">

            <div>

              <strong>
                Job Notifications
              </strong>

              <p>
                Receive notifications about jobs
                and application updates.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={notifications}
                onChange={handleNotificationToggle}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>


        {/* ======================================
            ACCOUNT ACTIONS
        ====================================== */}

        <div className="settings-section">

          <h2>Account Actions</h2>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* ======================================
            BACK
        ====================================== */}

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

      </div>

    </div>

  );

}

export default Settings;

