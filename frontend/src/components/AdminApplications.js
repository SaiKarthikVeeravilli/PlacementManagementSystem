import React, { useEffect, useState } from "react";
import api from "../services/axios";
import "./AdminApplications.css";

function AdminApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {

      const res = await api.get("/allapplications");

      if (res.data.success) {
        setApplications(res.data.applications);
      }

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to fetch applications"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchApplications();
  }, []);


  const updateStatus = async (applicationID, status) => {

    try {

      const res = await api.patch(
        `/updatestatus/${applicationID}`,
        { status }
      );

      if (res.data.success) {

        alert("Application status updated successfully");

        // Update UI immediately
        setApplications((previousApplications) =>
          previousApplications.map((application) =>
            application._id === applicationID
              ? {
                  ...application,
                  status: status
                }
              : application
          )
        );
      }

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to update application status"
      );

    }
  };


  if (loading) {
    return (
      <div className="admin-applications-container">
        <h1>Applications</h1>
        <p className="loading">Loading applications...</p>
      </div>
    );
  }


  return (

    <div className="admin-applications-container">

      {/* Header */}

      <div className="applications-header">

        <div>
          <h1>Applications</h1>

          <p>
            Manage student job applications
          </p>
        </div>

        <div className="application-count">
          {applications.length} Applications
        </div>

      </div>


      {/* No Applications */}

      {applications.length === 0 ? (

        <div className="no-applications">

          <h2>No Applications</h2>

          <p>
            No students have applied for jobs yet.
          </p>

        </div>

      ) : (

        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application._id}
            >

              {/* Student Information */}

              <div className="student-section">

                <div className="student-avatar">
                  {application.studentID?.userID?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div>

                  <h2>
                    {application.studentID?.userID?.name ||
                      "Unknown Student"}
                  </h2>

                  <p>
                    {application.studentID?.userID?.email ||
                      "No email"}
                  </p>

                </div>

              </div>


              {/* Application Information */}

              <div className="application-info">

                <div className="info-item">

                  <span>College</span>

                  <strong>
                    {application.studentID?.collegename ||
                      "N/A"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>Branch</span>

                  <strong>
                    {application.studentID?.branch ||
                      "N/A"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>CGPA</span>

                  <strong>
                    {application.studentID?.cgpa ||
                      "N/A"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>Job</span>

                  <strong>
                    {application.jobID?.jobtitle ||
                      "N/A"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>Company</span>

                  <strong>
                    {application.jobID?.companyID?.companyname ||
                      "N/A"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>Package</span>

                  <strong>
                    {application.jobID?.package
                      ? `${application.jobID.package} LPA`
                      : "N/A"}
                  </strong>

                </div>

              </div>


              {/* Status Section */}

              <div className="status-section">

                <div>

                  <span className="status-label">
                    Application Status
                  </span>

                  <span
                    className={`status-badge ${application.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {application.status}
                  </span>

                </div>


                <div className="status-update">

                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatus(
                        application._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Selected">
                      Selected
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                  </select>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminApplications;