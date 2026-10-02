import React, { useState } from "react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import "./CompanyForm.css";

function CompanyForm() {
  const navigate = useNavigate();

  const [company, changeCompany] = useState({
    companyname: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    logo: "",
  });

  const handleChange = (e) => {
    changeCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/addcompany", company);

      if (res.data.success) {
        alert("Company added successfully");
        navigate("/companies");
      }
      
    } catch (err) {
       console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);
  console.log("ERROR:", err);

  alert(JSON.stringify(err.response?.data, null, 2));

  console.log("Backend error:", err.response?.data);

  const message = err.response?.data?.message;

  if (typeof message === "object") {

    const firstError = Object.values(message)[0];

    alert(firstError?.message || "Invalid company details");

  } else {

    alert(message || "Something went wrong");

  }

}
  };

  return (
    <div className="company-container">

      <form className="company-form" onSubmit={submitHandler}>

        <h1>Add Company</h1>

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyname"
            value={company.companyname}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={company.description}
            onChange={handleChange}
            placeholder="Enter company description"
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={company.industry}
              onChange={handleChange}
              placeholder="Example: IT"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={company.location}
              onChange={handleChange}
              placeholder="Example: Hyderabad"
              required
            />
          </div>

        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={company.website}
            onChange={handleChange}
            placeholder="https://www.example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="url"
            name="logo"
            value={company.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <button type="submit">
          Add Company
        </button>

      </form>

    </div>
  );
}

export default CompanyForm;