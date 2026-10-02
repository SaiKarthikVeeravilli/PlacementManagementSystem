const JobModel = require("../Models/JobModel");
const ApplicationModel = require("../Models/ApplicationModel");

// ======================================================
// ADMIN → ADD JOB
// ======================================================

const addJob = async (req, res, next) => {
  try {
    const {
      companyID,
      jobtitle,
      description,
      location,
      package,
      eligibleBranches,
      minimumCGPA,
      maximumBacklogs,
      skills,
      deadline
    } = req.body;

   const deadlineDate = new Date(deadline);
deadlineDate.setHours(23, 59, 59, 999);

const job = await JobModel.create({
  companyID,
  jobtitle,
  description,
  location,
  package,
  eligibleBranches,
  minimumCGPA,
  maximumBacklogs,
  skills,
  deadline: deadlineDate
});
    return res.status(201).json({
      success: true,
      message: "Job added successfully",
      job
    });

  } catch (err) {
    next(err);
  }
};


// ======================================================
// GET JOBS
// SEARCH + FILTER + SORT + PAGINATION
// ======================================================

const getJobs = async (req, res, next) => {
  try {

    const {
      search,
      branch,
      location,
      minCGPA,
      minPackage,
      sort,
      activeOnly,
      page = 1,
      limit = 6
    } = req.query;


    // ==================================================
    // FILTER
    // ==================================================

    let filter = {};


    // ==================================================
    // SEARCH BY JOB TITLE
    // ==================================================

    if (search && search.trim()) {

      filter.jobtitle = {
        $regex: search.trim(),
        $options: "i"
      };

    }


    // ==================================================
    // FILTER BY BRANCH
    // ==================================================

    if (branch && branch.trim()) {

      const selectedBranch = branch.trim();

      filter.eligibleBranches = {
        $elemMatch: {
          $regex: `^${selectedBranch}$`,
          $options: "i"
        }
      };

    }


    // ==================================================
    // FILTER BY LOCATION
    // ==================================================

    if (location && location.trim()) {

      filter.location = {
        $regex: location.trim(),
        $options: "i"
      };

    }


    // ==================================================
    // MINIMUM CGPA
    // ==================================================

    if (
      minCGPA !== undefined &&
      minCGPA !== "" &&
      !isNaN(Number(minCGPA))
    ) {

      filter.minimumCGPA = {
        $gte: Number(minCGPA)
      };

    }


    // ==================================================
    // MINIMUM PACKAGE
    // ==================================================

    if (
      minPackage !== undefined &&
      minPackage !== "" &&
      !isNaN(Number(minPackage))
    ) {

      filter.package = {
        $gte: Number(minPackage)
      };

    }


    // ==================================================
    // ACTIVE JOBS ONLY
    // ==================================================

    if (activeOnly === "true") {

      filter.deadline = {
        $gte: new Date()
      };
    }
   


    // ==================================================
    // SORT
    // ==================================================

    let sortOption = {};


    if (sort === "packageAsc") {

      sortOption.package = 1;

    }

    else if (sort === "packageDesc") {

      sortOption.package = -1;

    }

    else if (sort === "cgpaAsc") {

      sortOption.minimumCGPA = 1;

    }

    else if (sort === "cgpaDesc") {

      sortOption.minimumCGPA = -1;

    }

    else if (sort === "deadlineAsc") {

      sortOption.deadline = 1;

    }

    else if (sort === "deadlineDesc") {

      sortOption.deadline = -1;

    }

    else {

      sortOption.deadline = 1;

    }


    // ==================================================
    // PAGINATION
    // ==================================================

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const jobsPerPage = Math.max(
      Number(limit) || 6,
      1
    );

    const skip =
      (currentPage - 1) * jobsPerPage;


    // ==================================================
    // TOTAL JOB COUNT
    // ==================================================

    const totalJobs =
      await JobModel.countDocuments(filter);


    const totalPages =
      Math.ceil(totalJobs / jobsPerPage);


    // ==================================================
    // FETCH JOBS
    // ==================================================

    const jobs = await JobModel
      .find(filter)
      .populate("companyID")
      .sort(sortOption)
      .skip(skip)
      .limit(jobsPerPage);


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      count: jobs.length,

      totalJobs,

      currentPage,

      totalPages,

      jobs

    });

  } catch (err) {

    next(err);

  }
};


// ======================================================
// UPDATE JOB
// ======================================================

const updateJob = async (req, res, next) => {
  try {

    const {
      companyID,
      jobtitle,
      description,
      location,
      package,
      eligibleBranches,
      minimumCGPA,
      maximumBacklogs,
      skills,
      deadline
    } = req.body;


    const job = await JobModel.findById(req.params.id);


    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found"
      });

    }


    job.companyID = companyID;
    job.jobtitle = jobtitle;
    job.description = description;
    job.location = location;
    job.package = package;
    job.eligibleBranches = eligibleBranches;
    job.minimumCGPA = minimumCGPA;
    job.maximumBacklogs = maximumBacklogs;
    job.skills = skills;
    const deadlineDate = new Date(deadline);
deadlineDate.setHours(23, 59, 59, 999);

job.deadline = deadlineDate;


    await job.save();


    return res.status(200).json({

      success: true,

      message: "Job updated successfully",

      job

    });

  } catch (err) {

    next(err);

  }
};


// ======================================================
// DELETE JOB
// ======================================================

const deleteJob = async (req, res, next) => {
  try {

    const job = await JobModel.findById(req.params.id);


    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found"
      });

    }


    // Delete applications associated with this job
    await ApplicationModel.deleteMany({
      jobID: job._id
    });


    // Delete job
    await JobModel.findByIdAndDelete(
      req.params.id
    );


    return res.status(200).json({

      success: true,

      message: "Job deleted successfully"

    });

  } catch (err) {

    next(err);

  }
};


module.exports = {
  addJob,
  getJobs,
  updateJob,
  deleteJob
};