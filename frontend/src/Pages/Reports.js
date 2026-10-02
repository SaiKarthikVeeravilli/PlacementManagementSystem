import React, { useEffect, useState } from "react";
import api from "../services/axios";
import './Reports.css'
const Reports = () => {

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const downloadPDF = async () => {
  try {

    const response = await api.get(
      "/admin/report/pdf",
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/pdf"
      })
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "placement-report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {

    console.log(err);

    alert("Failed to download PDF");

  }
};

  useEffect(() => {

    const fetchReport = async () => {

      try {

        const response = await api.get("/admin/report");

        setReport(response.data);

      } catch (err) {

        console.log(err);

        setError("Failed to load report");

      } finally {

        setLoading(false);

      }

    };

    fetchReport();

  }, []);


  if (loading) {
    return <h2>Loading report...</h2>;
  }


  if (error) {
    return <h2>{error}</h2>;
  }


  return (
  <div className="reports-container">

   <div className="reports-header">

  <h1>Placement Reports</h1>

  <button
    className="download-btn"
    onClick={downloadPDF}
  >
    Download PDF
  </button>

</div>


    {/* ========================= */}
    {/* OVERVIEW */}
    {/* ========================= */}

    <h2>Overview</h2>

    <div className="overview-grid">

      <div className="report-card">
        <h3>Total Students</h3>
        <p>{report.overview.totalStudents}</p>
      </div>

      <div className="report-card">
        <h3>Total Companies</h3>
        <p>{report.overview.totalCompanies}</p>
      </div>

      <div className="report-card">
        <h3>Total Jobs</h3>
        <p>{report.overview.totalJobs}</p>
      </div>

      <div className="report-card">
        <h3>Total Applications</h3>
        <p>{report.overview.totalApplications}</p>
      </div>

    </div>


    {/* ========================= */}
    {/* APPLICATION STATUS */}
    {/* ========================= */}

    <h2>Application Status</h2>

    <div className="status-grid">

      <div className="status-card">
        <h3>Applied</h3>
        <p>{report.applicationStatus.applied}</p>
      </div>

      <div className="status-card">
        <h3>Shortlisted</h3>
        <p>{report.applicationStatus.shortlisted}</p>
      </div>

      <div className="status-card">
        <h3>Selected</h3>
        <p>{report.applicationStatus.selected}</p>
      </div>

      <div className="status-card">
        <h3>Rejected</h3>
        <p>{report.applicationStatus.rejected}</p>
      </div>

    </div>


    {/* ========================= */}
    {/* PACKAGE */}
    {/* ========================= */}

    <h2>Package Statistics</h2>

    <div className="package-grid">

      <div className="package-card">
        <h3>Average Package</h3>

        <p>
          {report.packageStats.averagePackage.toFixed(2)}
        </p>
      </div>

      <div className="package-card">
        <h3>Highest Package</h3>

        <p>
          {report.packageStats.highestPackage}
        </p>
      </div>

      <div className="package-card">
        <h3>Lowest Package</h3>

        <p>
          {report.packageStats.lowestPackage}
        </p>
      </div>

    </div>

  </div>
);
}
export default Reports;