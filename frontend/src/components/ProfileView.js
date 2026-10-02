import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import "./ProfileView.css";

function ProfileView() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First get logged-in user
        const userRes = await api.get("/me");

        if (!userRes.data.success) {
          navigate("/login");
          return;
        }

        const loggedUser = userRes.data.user;

        setUser(loggedUser);

        // Admin does not have a student profile
        if (loggedUser.role === "admin") {
          return;
        }

        // Get student profile
        const profileRes = await api.get("/profile");

        if (profileRes.data.success) {
          setProfile(profileRes.data.profile);
        }

      } catch (err) {

        if (err.response?.status === 401) {
          navigate("/login");
        }

        else if (err.response?.status === 404) {
          // Student has not created profile yet
          navigate("/profile");
        }

        else {
          console.log(err);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // View Resume
  const handleViewResume = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/student/resume`,
      "_blank"
    );
  };

  // Download Resume
  const handleDownloadResume = async () => {
    try {

      const response = await api.get(
        "/student/resume",
        {
          responseType: "blob"
        }
      );

      const blob = new Blob(
        [response.data],
        { type: "application/pdf" }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = profile.resume.filename || "resume.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.log(err);

      alert("Unable to download resume");

    }
  };

  if (!profile || !user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-view">

      <h1>My Profile</h1>

      <button
        className="Edit"
        onClick={() => navigate(`/editprofile/${profile._id}`)}
      >
        Edit
      </button>

      <div className="profile-card">

        {/* Personal Information */}

        <h2>Personal Information</h2>

        <div className="profile-grid">

          <div>
            <strong>Name</strong>
            <p>{user.name}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{user.email}</p>
          </div>

          <div>
            <strong>Phone Number</strong>
            <p>{profile.phoneno}</p>
          </div>

          <div>
            <strong>Gender</strong>
            <p>{profile.gender}</p>
          </div>

        </div>


        {/* Academic Information */}

        <h2>Academic Information</h2>

        <div className="profile-grid">

          <div>
            <strong>College Name</strong>
            <p>{profile.collegename}</p>
          </div>

          <div>
            <strong>Branch</strong>
            <p>{profile.branch}</p>
          </div>

          <div>
            <strong>Current Year</strong>
            <p>{profile.currentyear}</p>
          </div>

          <div>
            <strong>Current Semester</strong>
            <p>{profile.currentsemester}</p>
          </div>

          <div>
            <strong>CGPA</strong>
            <p>{profile.cgpa}</p>
          </div>

          <div>
            <strong>10th Percentage</strong>
            <p>{profile.percentage10th}%</p>
          </div>

          <div>
            <strong>12th Percentage</strong>
            <p>{profile.percentage12th}%</p>
          </div>

          <div>
            <strong>Active Backlogs</strong>
            <p>{profile.activebacklogs}</p>
          </div>

          <div>
            <strong>Passing Year</strong>
            <p>{profile.passingyear}</p>
          </div>

        </div>


        {/* Skills */}

        <h2>Skills</h2>

        <div className="skills">

          {profile.skills.map((skill, index) => (
            <span key={index}>
              {skill}
            </span>
          ))}

        </div>


        {/* Professional Links */}

        <h2>Professional Links</h2>

        <div className="links">

          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

        </div>


        {/* Resume */}

        <h2>Resume</h2>

        <div className="resume-section">

          {profile.resume && profile.resume.filename ? (

            <div className="resume-card">

              <div className="resume-info">

                <span className="resume-icon">
                  📄
                </span>

                <div>
                  <strong>
                    {profile.resume.filename}
                  </strong>

                  {profile.resume.uploadedAt && (
                    <p>
                      Uploaded on{" "}
                      {new Date(
                        profile.resume.uploadedAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                </div>

              </div>


              <div className="resume-actions">

                <button
                  className="view-resume"
                  onClick={handleViewResume}
                >
                  View Resume
                </button>

                <button
                  className="download-resume"
                  onClick={handleDownloadResume}
                >
                  Download Resume
                </button>

              </div>

            </div>

          ) : (

            <div className="no-resume">
              <p>No resume uploaded.</p>

              <button
                onClick={() =>
                  navigate(`/editprofile/${profile._id}`)
                }
              >
                Upload Resume
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProfileView;