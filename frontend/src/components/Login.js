import React, { useState } from "react";
import api from "../services/axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const [userlogin, changeUserLogin] = useState({
    email: "",
    password: ""
  });


  const loginhandler = async (e) => {

    e.preventDefault();

    setErrors({
      email: "",
      password: ""
    });

    try {

      // ==============================
      // 1. LOGIN
      // ==============================

      const res = await api.post("/login", userlogin);

      if (!res.data.success) {
        return;
      }

      alert(res.data.message);

      changeUserLogin({
        email: "",
        password: ""
      });


      // ==============================
      // 2. GET LOGGED-IN USER
      // ==============================

      const userRes = await api.get("/me");

      if (!userRes.data.success) {

        alert("Unable to get user details");

        return;
      }

      const user = userRes.data.user;


      // ==============================
      // 3. ADMIN
      // ==============================

      if (user.role === "admin") {

        navigate("/admin-dashboard");

        return;
      }


      // ==============================
      // 4. STUDENT
      // ==============================

      try {

        const profileRes = await api.get("/profile");

        if (profileRes.data.success) {

          // Student already has profile
          navigate("/dashboard");

          return;
        }

      } catch (err) {

        // Student doesn't have profile
        if (err.response?.status === 404) {

          navigate("/profile");

          return;

        } else {

          alert(
            err.response?.data?.message ||
            "Unable to check profile"
          );

          return;
        }

      }

    } catch (err) {

  const error = err.response?.data?.message;

  if (error && typeof error === "object") {

    setErrors({
      email: typeof error.email === "string"
        ? error.email
        : "",

      password: typeof error.password === "string"
        ? error.password
        : ""
    });

  } else {

    alert(
      typeof error === "string"
        ? error
        : "Login failed"
    );

    changeUserLogin({
      email: "",
      password: ""
    });

  }

}

  };


  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={loginhandler}
      >

        <h1>
          Login
        </h1>


        {/* EMAIL */}

        <label>
          Email
        </label>

        <input
          type="email"
          value={userlogin.email}
          onChange={(e) => {

            changeUserLogin({
              ...userlogin,
              email: e.target.value
            });

            setErrors((prev) => ({
              ...prev,
              email: ""
            }));

          }}
        />

        {errors.email && (
  <p className="login-error">
    {errors.email}
  </p>
)}
        {/* PASSWORD */}

        <label>
          Password
        </label>

        <input
          type="password"
          value={userlogin.password}
          onChange={(e) => {

            changeUserLogin({
              ...userlogin,
              password: e.target.value
            });

            setErrors((prev) => ({
              ...prev,
              password: ""
            }));

          }}
        />

        {errors.password && (
  <p className="login-error">
    {errors.password}
  </p>
)}


        {/* LOGIN BUTTON */}

        <button type="submit">
          Login
        </button>
       <Link
  to="/forgot-password"
  className="forgot-password-link"
>
  Forgot Password?
</Link>


        {/* SIGNUP */}

        <p className="signuptext">

          Don't have an account?{" "}

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;