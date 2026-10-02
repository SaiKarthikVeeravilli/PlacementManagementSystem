import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { Link } from "react-router-dom";
import "./AdminDashBoard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    activeJobs: 0,
    totalApplications: 0,
    selectedStudents: 0
  });


  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await api.get("/admin/dashboard-stats");

        if (res.data.success) {

          setStats({
            totalStudents: res.data.totalStudents,
            totalCompanies: res.data.totalCompanies,
            activeJobs: res.data.activeJobs,
            totalApplications: res.data.totalApplications,
            selectedStudents: res.data.selectedStudents
          });

        }

      } catch (err) {

        console.log(
          err.response?.data?.message ||
          "Unable to fetch admin statistics"
        );

      }

    };

    fetchStats();

  }, []);


  return (

    <div className="admin-dashboard">


      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <div className="admin-logo">
          Placement Management System
        </div>

        <div className="admin-nav-links">

          <Link to="/admin-dashboard">
            Dashboard
          </Link>

          <Link to="/">
            Home
          </Link>

          <Link to="/companies">
            Companies
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/admin-applications">
            Applications
          </Link>

        </div>

      </nav>


      {/* ================= WELCOME ================= */}

      <div className="admin-welcome">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage students, companies, jobs and placement
          applications from one place.
        </p>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <h3>
            Total Students
          </h3>

          <p>
            {stats.totalStudents}
          </p>

        </div>


        <div className="admin-stat-card">

          <h3>
            Total Companies
          </h3>

          <p>
            {stats.totalCompanies}
          </p>

        </div>


        <div className="admin-stat-card">

          <h3>
            Active Jobs
          </h3>

          <p>
            {stats.activeJobs}
          </p>

        </div>


        <div className="admin-stat-card">

          <h3>
            Applications
          </h3>

          <p>
            {stats.totalApplications}
          </p>

        </div>


        <div className="admin-stat-card">

          <h3>
            Selected
          </h3>

          <p>
            {stats.selectedStudents}
          </p>

        </div>

      </div>


      {/* ================= QUICK ACTIONS ================= */}

      <div className="admin-section">

        <h2>
          Quick Actions
        </h2>

        <div className="admin-actions">

          <Link to="/addcompany">
            + Add Company
          </Link>

          <Link to="/addjob">
            + Add Job
          </Link>

          <Link to="/companies">
            Manage Companies
          </Link>

          <Link to="/jobs">
            Manage Jobs
          </Link>

          <Link to="/admin-applications">
            View Applications
          </Link>
            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/reports"> Reports</Link>
            <Link to="/admin/calendar">  Calendar</Link>

        </div>

      </div>


      {/* ================= MANAGEMENT ================= */}

      <div className="admin-section">

        <h2>
          Management
        </h2>


        <div className="management-grid">


          <div className="management-card">

            <h3>
              Companies
            </h3>

            <p>
              Add, edit and remove companies participating
              in campus placements.
            </p>

            <Link to="/companies">
              View Companies →
            </Link>

          </div>


          <div className="management-card">

            <h3>
              Jobs
            </h3>

            <p>
              Create and manage job opportunities and
              eligibility requirements.
            </p>

            <Link to="/jobs">
              View Jobs →
            </Link>

          </div>


          <div className="management-card">

            <h3>
              Applications
            </h3>

            <p>
              Review student applications and update
              their placement status.
            </p>

            <Link to="/admin-applications">
              View Applications →
            </Link>
          

          </div>


        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;