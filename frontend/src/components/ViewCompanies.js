import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import "./ViewCompanies.css";

function ViewCompanies() {
  const navigate = useNavigate();

  const [companies, changeCompanies] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const res = await api.get("/getcompany");



        if (res.data.success) {
          changeCompanies(res.data.company || []);
        }
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Unable to fetch companies"
        );
      }
    };

    const getUser = async () => {
      try {
        const res = await api.get("/me");

        if (res.data.success) {
          setRole(res.data.user.role);
        }
      } catch (err) {
        setRole("");
      }
    };

    getCompanies();
    getUser();
  }, []);
const deleteCompany = async (companyID) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this company?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    const res = await api.delete(
      `/deletecompany/${companyID}`
    );

    if (res.data.success) {

      alert(res.data.message);

      changeCompanies(
        companies.filter(company => company._id !== companyID)
      );

    }

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Unable to delete company"
    );

  }
};
  return (
    <div className="companies-container">

      {/* Header */}
      <div className="companies-header">
        <h1>Companies</h1>

        {role === "admin" && (
          <button
            className="add-company-btn"
            onClick={() => navigate("/addcompany")}
          >
            + Add Company
          </button>
        )}
      </div>

      {/* Companies */}
      {companies.length === 0 ? (

        <div className="no-companies">
          <p>No companies available.</p>
        </div>

      ) : (

        <div className="companies-list">

          {companies.map((company) => (

            <div
              className="company-card"
              key={company._id}
            >

              {/* Logo */}
              <div className="company-logo">

                {company.logo ? (

                  <img
                    src={company.logo}
                    alt={company.companyname}
                  />

                ) : (

                  <span>
                    {company.companyname
                      ? company.companyname
                          .charAt(0)
                          .toUpperCase()
                      : "C"}
                  </span>

                )}

              </div>

              {/* Company Details */}
              <div className="company-details">

                <h2>{company.companyname}</h2>

                <p className="industry">
                  {company.industry}
                </p>

                <p className="location">
                  📍 {company.location}
                </p>

                <p className="description">
                  {company.description}
                </p>

                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="website"
                  >
                    Visit Website
                  </a>
                )}

              </div>

              {/* Admin Actions */}
              {role === "admin" && (

                <div className="company-actions">

                  <button
                    className="edit-btn"
                   onClick={() =>
  navigate(`/editcompany/${company._id}`)
}
                  >
                    Edit
                  </button>
                  <button
    className="delete-btn"
    onClick={() => deleteCompany(company._id)}
  >
    Delete
  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ViewCompanies;