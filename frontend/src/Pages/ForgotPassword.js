import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (!email) {

      setError("Please enter your email");

      return;

    }


    try {

      setLoading(true);

      const response = await api.post(
        "/forgot-password",
        {
          email
        }
      );


      setMessage(response.data.message);

    } catch (err) {

  console.log(err);

  const errorMessage = err.response?.data?.message;

  if (typeof errorMessage === "string") {

    setError(errorMessage);

  } else if (
    errorMessage &&
    typeof errorMessage === "object"
  ) {

    if (errorMessage.email) {

      setError(errorMessage.email);

    } else {

      setError("Invalid email");

    }

  } else {

    setError("Something went wrong");

  }

}

  };


  return (

    <div className="forgot-password-container">

      <div className="forgot-password-card">

        <h1>Forgot Password?</h1>

        <p>
          Enter your registered email address.
        </p>


        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
          />


          {error && (
            <p className="forgot-error">
              {error}
            </p>
          )}


          {message && (
            <p className="forgot-success">
              {message}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

          </button>

        </form>


        <button
          className="back-login"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>

      </div>

    </div>

  );

};

export default ForgotPassword;