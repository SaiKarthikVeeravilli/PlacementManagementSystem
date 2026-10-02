import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import api from "../services/axios";
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import "./JobsView.css";


function Jobs() {

  // ==================================================
  // ROUTER
  // ==================================================

  const navigate = useNavigate();
  const locationState = useLocation();


  // ==================================================
  // JOBS + USER
  // ==================================================

  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  const [selectedJob, setSelectedJob] = useState(
    locationState.state?.selectedJob || null
  );


  // ==================================================
  // FILTER STATES
  // ==================================================

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [minCGPA, setMinCGPA] = useState("");
  const [minPackage, setMinPackage] = useState("");
  const [sort, setSort] = useState("");


  // ==================================================
  // PAGINATION STATES
  // ==================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);


  // ==================================================
  // JOBS PER PAGE
  // ==================================================

  const jobsPerPage = 6;


  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await api.get("/me");

        if (res.data.success) {

          setUser(res.data.user);

        }

      } catch (err) {

        console.log(err);

      }

    };

    fetchUser();

  }, []);


  // ==================================================
  // FETCH JOBS
  // ==================================================

  const fetchJobs = useCallback(
    async (
      page = 1,
      filters = {
        search: "",
        branch: "",
        location: "",
        minCGPA: "",
        minPackage: "",
        sort: ""
      }
    ) => {

      try {

        if (!user) {
          return;
        }


        // ==================================================
        // API PARAMETERS
        // ==================================================

        const params = {

          page: page,

          limit: jobsPerPage,

          activeOnly:
            user.role === "student"
              ? "true"
              : "false"

        };


        // ==================================================
        // SEARCH
        // ==================================================

        if (
          filters.search &&
          filters.search.trim()
        ) {

          params.search =
            filters.search.trim();

        }


        // ==================================================
        // BRANCH
        // ==================================================

        if (
          filters.branch &&
          filters.branch.trim()
        ) {

          params.branch =
            filters.branch.trim();

        }


        // ==================================================
        // LOCATION
        // ==================================================

        if (
          filters.location &&
          filters.location.trim()
        ) {

          params.location =
            filters.location.trim();

        }


        // ==================================================
        // MINIMUM CGPA
        // ==================================================

        if (
          filters.minCGPA !== undefined &&
          filters.minCGPA !== ""
        ) {

          params.minCGPA =
            filters.minCGPA;

        }


        // ==================================================
        // MINIMUM PACKAGE
        // ==================================================

        if (
          filters.minPackage !== undefined &&
          filters.minPackage !== ""
        ) {

          params.minPackage =
            filters.minPackage;

        }


        // ==================================================
        // SORT
        // ==================================================

        if (
          filters.sort &&
          filters.sort !== ""
        ) {

          params.sort =
            filters.sort;

        }


        // ==================================================
        // API REQUEST
        // ==================================================

        const res = await api.get(
          "/getjobs",
          {
            params: params
          }
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        if (res.data.success) {

          setJobs(
            res.data.jobs || []
          );

          setCurrentPage(
            res.data.currentPage
          );

          setTotalPages(
            res.data.totalPages
          );

          setTotalJobs(
            res.data.totalJobs
          );

        }

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Unable to fetch jobs"
        );

      }

    },
    [user]
  );


  // ==================================================
  // LOAD JOBS AFTER USER IS AVAILABLE
  // ==================================================

  useEffect(() => {

    if (user) {

      fetchJobs(1);

    }

  }, [user, fetchJobs]);


  // ==================================================
  // UPDATE SELECTED JOB FROM DASHBOARD
  // ==================================================

  useEffect(() => {

    if (locationState.state?.selectedJob) {

      setSelectedJob(
        locationState.state.selectedJob
      );

    }

  }, [locationState.state]);


  // ==================================================
  // CLOSE SELECTED JOB
  // ==================================================

  const closeSelectedJob = () => {

    setSelectedJob(null);

    navigate("/jobs", {
      replace: true,
      state: {}
    });

  };


  // ==================================================
  // SEARCH / FILTER / SORT
  // ==================================================

  const handleSearch = () => {

    const filters = {

      search: search,

      branch: branch,

      location: location,

      minCGPA: minCGPA,

      minPackage: minPackage,

      sort: sort

    };


    setCurrentPage(1);

    fetchJobs(
      1,
      filters
    );

  };


  // ==================================================
  // CHANGE PAGE
  // ==================================================

  const changePage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }


    const filters = {

      search: search,

      branch: branch,

      location: location,

      minCGPA: minCGPA,

      minPackage: minPackage,

      sort: sort

    };


    setCurrentPage(page);

    fetchJobs(
      page,
      filters
    );


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // ==================================================
  // APPLY FOR JOB
  // ==================================================

  const applyJob = async (jobID) => {

    try {

      const res = await api.post(
        "/apply",
        {
          jobID: jobID
        }
      );


      if (res.data.success) {

        alert(
          "Application submitted successfully"
        );

      }

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to apply"
      );

    }

  };


  // ==================================================
  // DELETE JOB
  // ==================================================

  const deleteJob = async (jobID) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const res = await api.delete(
        `/deletejob/${jobID}`
      );


      if (res.data.success) {

        alert(
          res.data.message
        );


        const filters = {

          search: search,

          branch: branch,

          location: location,

          minCGPA: minCGPA,

          minPackage: minPackage,

          sort: sort

        };


        fetchJobs(
          currentPage,
          filters
        );

      }

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to delete job"
      );

    }

  };


  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {

    setSearch("");
    setBranch("");
    setLocation("");
    setMinCGPA("");
    setMinPackage("");
    setSort("");

    setCurrentPage(1);


    const emptyFilters = {

      search: "",

      branch: "",

      location: "",

      minCGPA: "",

      minPackage: "",

      sort: ""

    };


    fetchJobs(
      1,
      emptyFilters
    );

  };


  // ==================================================
  // GENERATE PAGE NUMBERS
  // ==================================================

  const pageNumbers = [];


  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    pageNumbers.push(i);

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="jobs-container">


      {/* ==================================================
          SELECTED JOB DETAILS
      ================================================== */}

      {selectedJob && (

        <div className="selected-job-details">

          <div className="selected-job-header">

            <div>

              <h1>
                {selectedJob.jobtitle}
              </h1>

              <h2>
                {selectedJob.companyID?.companyname}
              </h2>

            </div>

            <button
              className="close-job-btn"
              onClick={closeSelectedJob}
            >
              Close
            </button>

          </div>


          <div className="selected-job-content">

            <p>
              <strong>
                Description:
              </strong>{" "}
              {selectedJob.description}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {selectedJob.location}
            </p>

            <p>
              <strong>
                Package:
              </strong>{" "}
              {selectedJob.package} LPA
            </p>

            <p>
              <strong>
                Minimum CGPA:
              </strong>{" "}
              {selectedJob.minimumCGPA}
            </p>

            <p>
              <strong>
                Maximum Backlogs:
              </strong>{" "}
              {selectedJob.maximumBacklogs}
            </p>

            <p>
              <strong>
                Eligible Branches:
              </strong>{" "}
              {selectedJob.eligibleBranches?.join(", ")}
            </p>

            <p>
              <strong>
                Required Skills:
              </strong>{" "}
              {selectedJob.skills?.join(", ")}
            </p>

            <p>
              <strong>
                Application Deadline:
              </strong>{" "}
              {new Date(
                selectedJob.deadline
              ).toLocaleDateString()}
            </p>

          </div>


          {user?.role === "student" && (

            <div className="selected-job-actions">

              <button
                className="apply-btn"
                onClick={() =>
                  applyJob(selectedJob._id)
                }
              >
                Apply
              </button>

              <button
                className="analyze-resume-btn"
                onClick={() =>
                  navigate(
                    `/resume-analyzer/${selectedJob._id}`
                  )
                }
              >
                Analyze My Resume
              </button>

            </div>

          )}

        </div>

      )}


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="jobs-header">

        <h1>

          {user?.role === "admin"
            ? "Job Management"
            : "Available Jobs"}

        </h1>


        {user?.role === "admin" && (

          <button
            className="add-job-btn"
            onClick={() =>
              navigate("/addjob")
            }
          >

            Add Job

          </button>

        )}

      </div>


      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="filters-container">


        <div className="filter-group">

          <label>
            Search Job
          </label>

          <input
            type="text"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            Branch
          </label>

          <select
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
          >

            <option value="">
              All Branches
            </option>

            <option value="CSE">
              CSE
            </option>

            <option value="CSE(AI)">
              CSE(AI)
            </option>

            <option value="CSE(DS)">
              CSE(DS)
            </option>

            <option value="ECE">
              ECE
            </option>

            <option value="EEE">
              EEE
            </option>

            <option value="IT">
              IT
            </option>

            <option value="MECH">
              MECH
            </option>

            <option value="CIVIL">
              CIVIL
            </option>

            <option value="CHEMICAL">
              CHEMICAL
            </option>

          </select>

        </div>


        <div className="filter-group">

          <label>
            Location
          </label>

          <input
            type="text"
            placeholder="Eg: Hyderabad"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            Minimum CGPA
          </label>

          <input
            type="number"
            placeholder="Eg: 7"
            min="0"
            max="10"
            step="0.1"
            value={minCGPA}
            onChange={(e) =>
              setMinCGPA(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            Minimum Package
          </label>

          <input
            type="number"
            placeholder="Eg: 5"
            min="0"
            value={minPackage}
            onChange={(e) =>
              setMinPackage(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >

            <option value="">
              Default
            </option>

            <option value="packageAsc">
              Package: Low → High
            </option>

            <option value="packageDesc">
              Package: High → Low
            </option>

            <option value="cgpaAsc">
              CGPA: Low → High
            </option>

            <option value="cgpaDesc">
              CGPA: High → Low
            </option>

            <option value="deadlineAsc">
              Deadline: Earliest → Latest
            </option>

            <option value="deadlineDesc">
              Deadline: Latest → Earliest
            </option>

          </select>

        </div>


        <div className="filter-buttons">

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>


          <button
            className="clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>

      </div>


      {/* ==================================================
          JOB COUNT
      ================================================== */}

      <div className="job-count">

        <p>

          Showing {jobs.length} of {totalJobs} jobs

        </p>

      </div>


      {/* ==================================================
          JOB LIST
      ================================================== */}

      <div className="jobs-list">

        {jobs.length === 0 ? (

          <p className="no-jobs">

            No jobs available matching
            your criteria.

          </p>

        ) : (

          jobs.map((job) => (

            <div
              className="job-card"
              key={job._id}
            >

              <h2>
                {job.jobtitle}
              </h2>


              <h3>
                {job.companyID?.companyname}
              </h3>


              <p>

                <strong>
                  Description:
                </strong>{" "}

                {job.description}

              </p>


              <p>

                <strong>
                  Location:
                </strong>{" "}

                {job.location}

              </p>


              <p>

                <strong>
                  Package:
                </strong>{" "}

                {job.package} LPA

              </p>


              <p>

                <strong>
                  Minimum CGPA:
                </strong>{" "}

                {job.minimumCGPA}

              </p>


              <p>

                <strong>
                  Maximum Backlogs:
                </strong>{" "}

                {job.maximumBacklogs}

              </p>


              <p>

                <strong>
                  Branches:
                </strong>{" "}

                {job.eligibleBranches?.join(", ")}

              </p>


              <p>

                <strong>
                  Skills:
                </strong>{" "}

                {job.skills?.join(", ")}

              </p>


              <p>

                <strong>
                  Deadline:
                </strong>{" "}

                {new Date(
                  job.deadline
                ).toLocaleDateString()}

              </p>


              {/* STUDENT */}

              {user?.role === "student" && (

                <div className="student-job-buttons">

                  <button
                    className="apply-btn"
                    onClick={() =>
                      applyJob(job._id)
                    }
                  >
                    Apply
                  </button>


                  <button
                    className="analyze-resume-btn"
                    onClick={() =>
                      navigate(
                        `/resume-analyzer/${job._id}`
                      )
                    }
                  >
                    Analyze My Resume
                  </button>

                </div>

              )}


              {/* ADMIN */}

              {user?.role === "admin" && (

                <div className="admin-buttons">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(
                        `/editjob/${job._id}`
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteJob(job._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              )}

            </div>

          ))

        )}

      </div>


      {/* ==================================================
          PAGINATION
      ================================================== */}

      {totalPages > 1 && (

        <div className="pagination">

          <button
            className="pagination-btn"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              changePage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>


          {pageNumbers.map((page) => (

            <button
              key={page}
              className={
                currentPage === page
                  ? "pagination-number active"
                  : "pagination-number"
              }
              onClick={() =>
                changePage(page)
              }
            >
              {page}
            </button>

          ))}


          <button
            className="pagination-btn"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              changePage(
                currentPage + 1
              )
            }
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

}


export default Jobs;