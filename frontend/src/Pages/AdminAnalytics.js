
import React, { useEffect, useState } from "react";
import api from "../services/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import {
  Bar,
  Doughnut,
  Line
} from "react-chartjs-2";

import "./AdminAnalytics.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const AdminAnalytics = () => {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

         const response = await api.get("/admin/analytics");

        setAnalytics(response.data);

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchAnalytics();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="analytics-page">

        <h2>Loading analytics...</h2>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="analytics-page">

        <h2>{error}</h2>

      </div>
    );

  }


  if (!analytics) {

    return (
      <div className="analytics-page">

        <h2>No analytics data available</h2>

      </div>
    );

  }


  // ==========================================
  // APPLICATION STATUS DATA
  // ==========================================

 const statusData = {
  labels: [
    "Applied",
    "Shortlisted",
    "Selected",
    "Rejected"
  ],

  datasets: [
    {
      label: "Applications",

      data: [
        analytics.applicationStatus.applied,
        analytics.applicationStatus.shortlisted,
        analytics.applicationStatus.selected,
        analytics.applicationStatus.rejected
      ],

      backgroundColor: [
        "#3b82f6",
        "#f59e0b",
        "#22c55e",
        "#ef4444"
      ],

      borderWidth: 1
    }
  ]
};


  // ==========================================
  // BRANCH DATA
  // ==========================================

  const branchData = {
  labels: analytics.branchStats.map(
    item => item._id
  ),

  datasets: [
    {
      label: "Students",

      data: analytics.branchStats.map(
        item => item.students
      ),

      backgroundColor: "#6366f1",

      borderWidth: 1
    }
  ]
};


  // ==========================================
  // COMPANY DATA
  // ==========================================

const companyData = {
  labels: analytics.companyStats.map(
    item => item.companyName
  ),

  datasets: [
    {
      label: "Selected Students",

      data: analytics.companyStats.map(
        item => item.selected
      ),

      backgroundColor: "#14b8a6",

      borderWidth: 1
    }
  ]
};


  // ==========================================
  // APPLICATION TREND DATA
  // ==========================================

  const trendData = {
  labels: analytics.applicationTrends.map(
    item => item._id
  ),

  datasets: [
    {
      label: "Applications",

      data: analytics.applicationTrends.map(
        item => item.applications
      ),

      borderColor: "#8b5cf6",

      backgroundColor: "#8b5cf6",

      borderWidth: 2,

      tension: 0.3
    }
  ]
};


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="analytics-page">

      <h1>Placement Analytics</h1>


      {/* ================================= */}
      {/* OVERVIEW CARDS */}
      {/* ================================= */}

      <div className="analytics-cards">


        <div className="analytics-card">

          <h3>Total Students</h3>

          <p>
            {analytics.overview.totalStudents}
          </p>

        </div>


        <div className="analytics-card">

          <h3>Total Companies</h3>

          <p>
            {analytics.overview.totalCompanies}
          </p>

        </div>


        <div className="analytics-card">

          <h3>Total Jobs</h3>

          <p>
            {analytics.overview.totalJobs}
          </p>

        </div>


        <div className="analytics-card">

          <h3>Active Jobs</h3>

          <p>
            {analytics.overview.activeJobs}
          </p>

        </div>


        <div className="analytics-card">

          <h3>Total Applications</h3>

          <p>
            {analytics.overview.totalApplications}
          </p>

        </div>


        <div className="analytics-card">

          <h3>Selected Students</h3>

          <p>
            {analytics.overview.selectedStudents}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* APPLICATION STATUS */}
      {/* ================================= */}

      <div className="analytics-section">

        <h2>Application Status</h2>

        <div className="chart-container">

          <Doughnut
            data={statusData}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* BRANCH STATISTICS */}
      {/* ================================= */}

      <div className="analytics-section">

        <h2>Branch-wise Students</h2>

        <div className="chart-container">

          <Bar
            data={branchData}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* COMPANY STATISTICS */}
      {/* ================================= */}

      <div className="analytics-section">

        <h2>Company-wise Selections</h2>

        <div className="chart-container">

          <Bar
            data={companyData}
          />

        </div>

      </div>


      {/* ================================= */}
      {/* PACKAGE STATISTICS */}
      {/* ================================= */}

      <div className="analytics-section">

        <h2>Package Statistics</h2>


        <div className="package-container">


          <div>

            <h3>
              Average Package
            </h3>

            <p>
              {analytics.packageStats.averagePackage
                ? analytics.packageStats.averagePackage.toFixed(2)
                : 0}
            </p>

          </div>


          <div>

            <h3>
              Highest Package
            </h3>

            <p>
              {analytics.packageStats.highestPackage}
            </p>

          </div>


          <div>

            <h3>
              Lowest Package
            </h3>

            <p>
              {analytics.packageStats.lowestPackage}
            </p>

          </div>


        </div>

      </div>


      {/* ================================= */}
      {/* APPLICATION TRENDS */}
      {/* ================================= */}

      <div className="analytics-section">

        <h2>Application Trends</h2>

        <div className="chart-container">

          <Line
            data={trendData}
          />

        </div>

      </div>


    </div>

  );

};


export default AdminAnalytics;

