import React, { useEffect, useState } from "react";
import api from "../services/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./JobForm.css";

function EditJob() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [companies, setCompanies] = useState([]);

  const [job, setJob] = useState({
    companyID: "",
    jobtitle: "",
    description: "",
    location: "",
    package: "",
    eligibleBranches: "",
    minimumCGPA: "",
    maximumBacklogs: "",
    skills: "",
    deadline: ""
  });

  useEffect(() => {

    const fetchData = async () => {

      try {

        // Get companies
        const companyRes = await api.get("/getcompany");

        if (companyRes.data.success) {
          setCompanies(companyRes.data.company);
        }

        // Get jobs
        const jobRes = await api.get("/getjobs");

        if (jobRes.data.success) {

          const foundJob = jobRes.data.jobs.find(
            job => job._id === id
          );

          if (!foundJob) {
            alert("Job not found");
            navigate("/jobs");
            return;
          }

          setJob({
            companyID: foundJob.companyID?._id || foundJob.companyID || "",
            jobtitle: foundJob.jobtitle || "",
            description: foundJob.description || "",
            location: foundJob.location || "",
            package: foundJob.package || "",
            eligibleBranches:
              foundJob.eligibleBranches
                ? foundJob.eligibleBranches.join(", ")
                : "",
            minimumCGPA: foundJob.minimumCGPA || "",
            maximumBacklogs: foundJob.maximumBacklogs || "",
            skills:
              foundJob.skills
                ? foundJob.skills.join(", ")
                : "",
            deadline: foundJob.deadline
              ? foundJob.deadline.substring(0, 10)
              : ""
          });
        }

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Unable to load job"
        );

      }

    };

    fetchData();

  }, [id, navigate]);


  const handleChange = (e) => {

    setJob({
      ...job,
      [e.target.name]: e.target.value
    });

  };


  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const sendData = {
        ...job,

        eligibleBranches: job.eligibleBranches
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== ""),

        skills: job.skills
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== "")
      };

      const res = await api.put(
        `/editjob/${id}`,
        sendData
      );

      if (res.data.success) {

        alert(res.data.message);

        navigate("/jobs");

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


  return (

    <div className="job-container">

      <form
        className="job-form"
        onSubmit={submitHandler}
      >

        <h1>Edit Job</h1>


        <div className="form-group">

          <label>Company</label>

          <select
            name="companyID"
            value={job.companyID}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Company
            </option>

            {companies.map((company) => (

              <option
                key={company._id}
                value={company._id}
              >
                {company.companyname}
              </option>

            ))}

          </select>

        </div>


        <div className="form-group">

          <label>Job Title</label>

          <input
            type="text"
            name="jobtitle"
            value={job.jobtitle}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>Description</label>

          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>Location</label>

            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Package (LPA)</label>

            <input
              type="number"
              name="package"
              value={job.package}
              onChange={handleChange}
              required
            />

          </div>

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>Minimum CGPA</label>

            <input
              type="number"
              step="0.1"
              name="minimumCGPA"
              value={job.minimumCGPA}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Maximum Backlogs</label>

            <input
              type="number"
              name="maximumBacklogs"
              value={job.maximumBacklogs}
              onChange={handleChange}
              required
            />

          </div>

        </div>


        <div className="form-group">

          <label>Eligible Branches</label>

          <input
            type="text"
            name="eligibleBranches"
            value={job.eligibleBranches}
            onChange={handleChange}
            placeholder="CSE, IT, ECE"
            required
          />

        </div>


        <div className="form-group">

          <label>Required Skills</label>

          <input
            type="text"
            name="skills"
            value={job.skills}
            onChange={handleChange}
            placeholder="Java, SQL, Git"
            required
          />

        </div>


        <div className="form-group">

          <label>Application Deadline</label>

          <input
            type="date"
            name="deadline"
            value={job.deadline}
            onChange={handleChange}
            required
          />

        </div>


        <button type="submit">
          Update Job
        </button>

        <button
          type="button"
          onClick={() => navigate("/jobs")}
        >
          Cancel
        </button>

      </form>

    </div>

  );
}

export default EditJob;