import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "./MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/myapplications");

        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // Decide CSS class according to status
  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Shortlisted":
        return "status-shortlisted";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  return (
    <div className="applications-container">

      <h1>My Applications</h1>

      {applications.length === 0 ? (

        <p>You haven't applied for any jobs yet.</p>

      ) : (

        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application._id}
            >

              <h2>
                {application.jobID?.jobtitle}
              </h2>

              <h3>
                {application.jobID?.companyID?.companyname}
              </h3>

              <p>
                Location: {application.jobID?.location}
              </p>

              <p>
                Package: {application.jobID?.package} LPA
              </p>

              <div className="application-status">

                <span>Status:</span>

                <strong
                  className={getStatusClass(application.status)}
                >
                  {application.status}
                </strong>

              </div>

              {/* Application progress */}

              {application.status !== "Rejected" && (

                <div className="status-progress">

                  <div
                    className={
                      application.status === "Applied" ||
                      application.status === "Shortlisted" ||
                      application.status === "Selected"
                        ? "step active"
                        : "step"
                    }
                  >
                    <span>1</span>
                    <p>Applied</p>
                  </div>

                  <div
                    className={
                      application.status === "Shortlisted" ||
                      application.status === "Selected"
                        ? "step active"
                        : "step"
                    }
                  >
                    <span>2</span>
                    <p>Shortlisted</p>
                  </div>

                  <div
                    className={
                      application.status === "Selected"
                        ? "step active"
                        : "step"
                    }
                  >
                    <span>3</span>
                    <p>Selected</p>
                  </div>

                </div>

              )}

              {application.status === "Rejected" && (

                <div className="rejected-message">
                  Your application was rejected.
                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyApplications;