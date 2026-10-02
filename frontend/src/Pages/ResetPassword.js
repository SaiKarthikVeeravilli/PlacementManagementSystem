import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import "./ResetPassword.css";

const ResetPassword = () => {

  const { token } = useParams();

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // Check passwords
    if (newPassword !== confirmPassword) {

      setError("Passwords do not match");

      return;
    }


    try {

      setLoading(true);

      const response = await api.post(
        `/reset-password/${token}`,
        {
          newPassword,
          confirmPassword
        }
      );


      setMessage(response.data.message);


      // Go to login after 2 seconds
      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to reset password"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="reset-password-container">

      <div className="reset-password-card">

        <h1>Reset Password</h1>

        <p>
          Enter your new password below.
        </p>


        <form onSubmit={handleSubmit}>

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


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
          />


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {message && (
            <p className="success-message">
              {message}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default ResetPassword;