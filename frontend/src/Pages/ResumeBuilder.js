import React, { useState } from "react";
import "./ResumeBuilder.css";

function ResumeBuilder() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    careerObjective: "",
    education: "",
    skills: "",
    projects: "",
    experience: "",
    certifications: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-builder-page">
      <div className="resume-builder-header">
        <h1>Resume Builder</h1>
        <p>Create and preview your placement resume</p>
      </div>

      <div className="resume-builder-container">

        <div className="resume-form">
          <h2>Enter Your Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <textarea
            name="careerObjective"
            placeholder="Career Objective"
            value={formData.careerObjective}
            onChange={handleChange}
          />

          <textarea
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
          />

          <textarea
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleChange}
          />

          <textarea
            name="projects"
            placeholder="Projects"
            value={formData.projects}
            onChange={handleChange}
          />

          <textarea
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <textarea
            name="certifications"
            placeholder="Certifications"
            value={formData.certifications}
            onChange={handleChange}
          />

          <button onClick={handlePrint}>
            Download / Print Resume
          </button>
        </div>

        <div className="resume-preview">
          <h2>Resume Preview</h2>

          <div className="resume-paper">
            <h1>{formData.name || "Your Name"}</h1>

            <p>
              {formData.email || "Email"} |{" "}
              {formData.phone || "Phone"}
            </p>

            <hr />

            <h3>Career Objective</h3>
            <p>
              {formData.careerObjective ||
                "Your career objective will appear here."}
            </p>

            <h3>Education</h3>
            <p>
              {formData.education ||
                "Your education details will appear here."}
            </p>

            <h3>Skills</h3>
            <p>
              {formData.skills ||
                "Your skills will appear here."}
            </p>

            <h3>Projects</h3>
            <p>
              {formData.projects ||
                "Your projects will appear here."}
            </p>

            <h3>Experience</h3>
            <p>
              {formData.experience ||
                "Your experience will appear here."}
            </p>

            <h3>Certifications</h3>
            <p>
              {formData.certifications ||
                "Your certifications will appear here."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResumeBuilder;