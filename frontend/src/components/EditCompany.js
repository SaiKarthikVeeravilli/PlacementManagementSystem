import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyForm.css";

function EditCompany() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [company, changeCompany] = useState({
    companyname: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCompany = async () => {

      try {

        const res = await api.get("/getcompany");

        if (res.data.success) {

          const foundCompany = res.data.company.find(
            company => company._id === id
          );

          if (!foundCompany) {
            alert("Company not found");
            navigate("/companies");
            return;
          }

          changeCompany({
            companyname: foundCompany.companyname || "",
            description: foundCompany.description || "",
            industry: foundCompany.industry || "",
            location: foundCompany.location || "",
            website: foundCompany.website || "",
            logo: foundCompany.logo || "",
          });
        }

      } catch (err) {

        alert(
          err.response?.data?.message ||
          "Unable to fetch company"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchCompany();

  }, [id, navigate]);


  const handleChange = (e) => {

    changeCompany({
      ...company,
      [e.target.name]: e.target.value,
    });

  };


  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const res = await api.put(
        `/editcompany/${id}`,
        company
      );

      if (res.data.success) {

        alert(res.data.message);

        navigate("/companies");

      }

    } catch (err) {

      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  if (loading) {
    return <p>Loading company...</p>;
  }


  return (

    <div className="company-container">

      <form
        className="company-form"
        onSubmit={submitHandler}
      >

        <h1>Edit Company</h1>


        <div className="form-group">

          <label>Company Name</label>

          <input
            type="text"
            name="companyname"
            value={company.companyname}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>Description</label>

          <textarea
            name="description"
            value={company.description}
            onChange={handleChange}
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
          />

        </div>


        <button type="submit">
          Update Company
        </button>


        <button
          type="button"
          onClick={() => navigate("/companies")}
        >
          Cancel
        </button>

      </form>

    </div>

  );
}

export default EditCompany;