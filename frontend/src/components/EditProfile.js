import React, { useEffect, useState } from "react";
import "./studentForm.css";
import api from "../services/axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState({
    phoneno: "",
    gender: "",
    collegename: "",
    branch: "",
    currentyear: "",
    currentsemester: "",
    cgpa: "",
    percentage10th: "",
    percentage12th: "",
    activebacklogs: "",
    passingyear: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        if (res.data.success) {
          const data = res.data.profile;

          setProfile({
            phoneno: data.phoneno || "",
            gender: data.gender || "",
            collegename: data.collegename || "",
            branch: data.branch || "",
            currentyear: data.currentyear || "",
            currentsemester: data.currentsemester || "",
            cgpa: data.cgpa || "",
            percentage10th: data.percentage10th || "",
            percentage12th: data.percentage12th || "",
            activebacklogs: data.activebacklogs || "",
            passingyear: data.passingyear || "",

            // Convert array → string
            skills: data.skills ? data.skills.join(", ") : "",

            github: data.github || "",
            linkedin: data.linkedin || "",
          });
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 404) {
          navigate("/profile");
        } else {
          alert(
            err.response?.data?.message ||
            "Unable to fetch profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle normal input changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle resume selection
  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  // Update profile
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Profile data
      formData.append("phoneno", profile.phoneno);
      formData.append("gender", profile.gender);
      formData.append("collegename", profile.collegename);
      formData.append("branch", profile.branch);
      formData.append("currentyear", profile.currentyear);
      formData.append("currentsemester", profile.currentsemester);
      formData.append("cgpa", profile.cgpa);
      formData.append("percentage10th", profile.percentage10th);
      formData.append("percentage12th", profile.percentage12th);
      formData.append("activebacklogs", profile.activebacklogs);
      formData.append("passingyear", profile.passingyear);
      formData.append("skills", profile.skills);
      formData.append("github", profile.github);
      formData.append("linkedin", profile.linkedin);

      // Add resume only if a new file is selected
      if (resume) {
        formData.append("resume", resume);
      }

      const res = await api.put(
        `/student/profile/${id}`,
        formData
      );

      if (res.data.success) {
        alert(res.data.message);
        navigate("/profile-view");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="student-container">

      <form
        className="student-form"
        onSubmit={submitHandler}
      >

        <h2>Edit Student Profile</h2>

        {/* Personal Information */}

        <h3 className="section-title">
          Personal Information
        </h3>

        <div className="form-grid">

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phoneno"
              value={profile.phoneno}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              maxLength={10}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={profile.gender === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={profile.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={profile.gender === "Others"}
                  onChange={handleChange}
                />
                Others
              </label>

            </div>
          </div>

        </div>

        {/* Academic Information */}

        <h3 className="section-title">
          Academic Information
        </h3>

        <div className="form-grid">

          <div className="form-group full-width">
            <label>College Name</label>

            <input
              type="text"
              name="collegename"
              value={profile.collegename}
              onChange={handleChange}
              placeholder="Enter College Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Branch</label>

            <select
              name="branch"
              value={profile.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              <option>CSE</option>
              <option>CSE(AI)</option>
              <option>CSE(DS)</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>IT</option>
              <option>MECH</option>
              <option>CIVIL</option>
              <option>CHEMICAL</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current Year</label>

            <select
              name="currentyear"
              value={profile.currentyear}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current Semester</label>

            <select
              name="currentsemester"
              value={profile.currentsemester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Passing Year</label>

            <input
              type="number"
              name="passingyear"
              value={profile.passingyear}
              onChange={handleChange}
              placeholder="2028"
            />
          </div>

          <div className="form-group">
            <label>CGPA</label>

            <input
              type="number"
              name="cgpa"
              value={profile.cgpa}
              onChange={handleChange}
              step="0.01"
              placeholder="8.50"
            />
          </div>

          <div className="form-group">
            <label>Active Backlogs</label>

            <input
              type="number"
              name="activebacklogs"
              value={profile.activebacklogs}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>10th Percentage</label>

            <input
              type="number"
              name="percentage10th"
              value={profile.percentage10th}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>12th Percentage</label>

            <input
              type="number"
              name="percentage12th"
              value={profile.percentage12th}
              onChange={handleChange}
              step="0.01"
            />
          </div>

        </div>

        {/* Skills */}

        <h3 className="section-title">
          Skills
        </h3>

        <div className="form-grid">

          <div className="form-group full-width">

            <label>Skills</label>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Java, React, Node.js, MongoDB..."
            />

          </div>

        </div>

        {/* Professional Links */}

        <h3 className="section-title">
          Professional Links
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>GitHub</label>

            <input
              type="url"
              name="github"
              value={profile.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />

          </div>

          <div className="form-group">

            <label>LinkedIn</label>

            <input
              type="url"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />

          </div>

        </div>

        {/* Resume */}

        <h3 className="section-title">
          Resume
        </h3>

        <div className="form-grid">

          <div className="form-group full-width">

            <label>Replace Resume</label>

            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleResumeChange}
            />

            <small>
              Select a new PDF only if you want to replace
              your existing resume.
            </small>

          </div>

        </div>

        {/* Buttons */}

        <button type="submit">
          Update Profile
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile-view")}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default EditProfile;