import React, { useState, useEffect } from "react";
import api from "../services/axios";
import { Link, useNavigate } from "react-router-dom";
import "./DashBoard.css";

function DashBoard() {

  const navigate = useNavigate();

  const [loginDetails, changeLoginDetails] = useState(null);
  const [profile, changeProfile] = useState(null);

  const [stats, setStats] = useState({
    availableJobs: 0,
    appliedJobs: 0,
    selected: 0
  });

  // ==============================
  // RECENT JOBS
  // ==============================

  const [recentJobs, setRecentJobs] = useState([]);

  // ==============================
  // GET LOGGED-IN USER
  // ==============================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await api.get("/me");

        if (res.data.success) {

          const user = res.data.user;

          // Admin should never stay on student dashboard
          if (user.role === "admin") {

            navigate("/admin-dashboard");

            return;

          }

          changeLoginDetails(user);

        }

      } catch (err) {

        changeLoginDetails(null);

        navigate("/login");

      }

    };

    fetchUser();

  }, [navigate]);


  // ==============================
  // GET STUDENT PROFILE
  // ==============================

  useEffect(() => {

    const getProfile = async () => {

      if (!loginDetails) {
        return;
      }

      try {

        const res = await api.get("/profile");

        if (res.data.success) {

          changeProfile(res.data.profile);

        }

      } catch (err) {

        if (err.response?.status === 404) {

          navigate("/profile");

        }

      }

    };

    getProfile();

  }, [loginDetails, navigate]);


  // ==============================
  // GET DASHBOARD STATISTICS
  // ==============================

  useEffect(() => {

    const fetchStats = async () => {

      if (!loginDetails) {
        return;
      }

      try {

        const res = await api.get("/dashboard-stats");

        if (res.data.success) {

          setStats({
            availableJobs: res.data.availableJobs,
            appliedJobs: res.data.appliedJobs,
            selected: res.data.selected
          });

        }

      } catch (err) {

        console.log(
          err.response?.data?.message ||
          "Unable to fetch dashboard statistics"
        );

      }

    };

    fetchStats();

  }, [loginDetails]);


  // ==============================
  // GET RECENT JOBS
  // ==============================

  useEffect(() => {

    const fetchRecentJobs = async () => {

      if (!loginDetails) {
        return;
      }

      try {

        const res = await api.get(
          "/getjobs",
          {
            params: {
              page: 1,
              limit: 3,
              activeOnly: "true"
            }
          }
        );

        if (res.data.success) {

          setRecentJobs(
            res.data.jobs || []
          );

        }

      } catch (err) {

        console.log(
          err.response?.data?.message ||
          "Unable to fetch recent jobs"
        );

      }

    };

    fetchRecentJobs();

  }, [loginDetails]);


  // ==============================
  // LOGOUT
  // ==============================

  const logoutHandler = async () => {

    try {

      const res = await api.get("/logout");

      if (res.data.success) {

        alert("logged out successfully");

        navigate("/");

      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Logout failed"
      );

    }

  };


  return (

    <div className="dashboard">


      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">

        <p>
          Placement Management System
        </p>

        <p>
          Welcome, {loginDetails?.name}
        </p>

      </nav>


      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="menu">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/">
            Home
          </Link>

          <Link to="/profile-view">
            My Profile
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/applications">
            My Applications
          </Link>

          <Link to="/companies">
            Companies
          </Link>

          <Link to="/student/calendar">
            Calendar
          </Link>

          <Link to="/settings">
            Settings
          </Link>

        </div>


        <div className="logout">

          <button onClick={logoutHandler}>
            Logout
          </button>

        </div>

      </div>


      {/* ================= MAIN CONTENT ================= */}

      <div className="mainContent">


        {/* ================= WELCOME ================= */}

        <div className="welcome">

          <h2>
            Dashboard
          </h2>

          <div className="welcome-content">

            <h2>
              Welcome, {loginDetails?.name}
            </h2>

            <p>
              Manage your placement activities and career
              opportunities from here.
            </p>

          </div>

        </div>


        {/* ================= PROFILE SUMMARY ================= */}

        <div className="profileSummary">


          {/* Student Basic Information */}

          <div className="layer1">

            <div className="profile-image">
              👤
            </div>

            <div className="student-basic">

              <h3>
                {loginDetails?.name}
              </h3>

              <p>
                {profile?.branch}
              </p>

              <p>
                {profile?.collegename}
              </p>

            </div>

          </div>


          {/* Student Information */}

          <div className="layer2">

            <div className="info-item">

              <span>
                CGPA
              </span>

              <strong>
                {profile?.cgpa}
              </strong>

            </div>


            <div className="info-item">

              <span>
                Passing Year
              </span>

              <strong>
                {profile?.passingyear}
              </strong>

            </div>


            <div className="info-item">

              <span>
                Current Year
              </span>

              <strong>
                {profile?.currentyear}
              </strong>

            </div>


            <div className="info-item">

              <span>
                Current Semester
              </span>

              <strong>
                {profile?.currentsemester}
              </strong>

            </div>


            <div className="info-item">

              <span>
                Active Backlogs
              </span>

              <strong>
                {profile?.activebacklogs}
              </strong>

            </div>

          </div>

        </div>


        {/* ================= STATISTICS ================= */}

        <div className="stats">


          <div
            className="stat-card"
            id="card1"
          >

            <h3 id="card-color">
              Available Jobs
            </h3>

            <p>
              {stats.availableJobs}
            </p>

          </div>


          <div
            className="stat-card"
            id="card2"
          >

            <h3 id="card-color">
              Applied Jobs
            </h3>

            <p>
              {stats.appliedJobs}
            </p>

          </div>


          <div
            className="stat-card"
            id="card3"
          >

            <h3 id="card-color">
              Selected
            </h3>

            <p>
              {stats.selected}
            </p>

          </div>

        </div>


        {/* ================= RECENT JOBS ================= */}

        <div className="recentJobs">

          <h2>
            Recent Job Opportunities
          </h2>


          <div className="jobCards">

            {recentJobs.length === 0 ? (

              <p>
                No recent job opportunities available.
              </p>

            ) : (

              recentJobs.map((job) => (

                <div
                  className="jobCard"
                  key={job._id}
                >

                  <h3>
                    {job.companyID?.companyname || "Company"}
                  </h3>

                  <p className="jobRole">
                    {job.jobtitle}
                  </p>

                  <p>
                    Location: {job.location}
                  </p>

                  <p>
                    Package: {job.package} LPA
                  </p>

                  <p>
                    Minimum CGPA: {job.minimumCGPA}
                  </p>

                  <p>
                    Deadline:{" "}
                    {new Date(
                      job.deadline
                    ).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() =>
                      navigate("/jobs", {
                        state: {
                          selectedJob: job
                        }
                      })
                    }
                  >
                    View Job
                  </button>

                </div>

              ))

            )}

          </div>

        </div>


        {/* ================= SKILLS ================= */}

        <div className="skills-section">

          <h2>
            Skill Set
          </h2>

          <div className="skills-container">

            {profile?.skills?.length > 0 ? (

              profile.skills.map((skill, index) => (

                <span
                  className="skill"
                  key={index}
                >
                  {skill}
                </span>

              ))

            ) : (

              <p>
                No skills added yet.
              </p>

            )}

          </div>

        </div>


        {/* ================= QUICK LINKS ================= */}

        <div className="quick-links-section">

          <h2>
            Quick Links
          </h2>

          <div className="quick-links">

            <Link to="/jobs">
              Browse Jobs
            </Link>

            <Link to="/resume-builder">
              Resume Builder
            </Link>

            <Link to="/companies">
              Top Companies
            </Link>

            <Link to="/resources">
              Placement Resources
            </Link>

          </div>

        </div>


      </div>

    </div>

  );

}

export default DashBoard;