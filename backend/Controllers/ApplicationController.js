const ApplicationModel = require("../Models/ApplicationModel");
const StudentModel = require("../Models/StudentModel");
const JobModel = require("../Models/JobModel");
const NotificationModel = require("../Models/NotificationModel");

// Student → Apply for a job
const applyJob = async (req, res, next) => {
  try {
 

    const { jobID } = req.body;
  
 if (!jobID) {
      return res.status(400).json({
        success: false,
        message: "Job id not found"
      });
    }
    // Check whether student profile exists
    const student = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Please complete your profile first"
      });
    }

    // Check whether job exists
    const job = await JobModel.findById(jobID);
     if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    if (job.deadline < new Date()) {
  return res.status(400).json({
    success: false,
    message: "Application deadline has passed"
  });
}

   

    // Check CGPA
    if (student.cgpa < job.minimumCGPA) {
      return res.status(400).json({
        success: false,
        message: `You are not eligible. Minimum CGPA required is ${job.minimumCGPA}`
      });
    }

    // Check backlogs
    if (student.activebacklogs > job.maximumBacklogs) {
      return res.status(400).json({
        success: false,
        message: `You are not eligible. Maximum allowed backlogs are ${job.maximumBacklogs}`
      });
    }

    // Check branch
    const studentBranch = student.branch.trim().toLowerCase();

const eligibleBranches = job.eligibleBranches.map(branch =>
  branch.trim().toLowerCase()
);

if (!eligibleBranches.includes(studentBranch)) {
  return res.status(400).json({
    success: false,
    message: "Your branch is not eligible for this job"
  });
}
    // Check skills
const studentSkills = student.skills.map(skill =>
  skill.trim().toLowerCase()
);

const requiredSkills = job.skills.map(skill =>
  skill.trim().toLowerCase()
);

const hasAllSkills = requiredSkills.every(skill =>
  studentSkills.includes(skill)
);

if (!hasAllSkills) {
  return res.status(400).json({
    success: false,
    message: "You do not have all the required skills for this job"
  });
}

    // Check whether student already applied
    const alreadyApplied = await ApplicationModel.findOne({
      studentID: student._id,
      jobID: jobID
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Create application
    const application = await ApplicationModel.create({
      studentID: student._id,
      jobID: jobID
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (err) {
    next(err);
  }
};
const getMyApplications = async (req, res, next) => {
  try {

    // Find logged-in student's profile
    const student = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    // Find applications of this student
    const applications = await ApplicationModel
      .find({
        studentID: student._id
      })
      .populate({
        path: "jobID",
        populate: {
          path: "companyID"
        }
      });

    return res.status(200).json({
      success: true,
      applications
    });

  } catch (err) {
    next(err);
  }
};
const getAllApplications = async (req, res, next) => {
  try {

    const applications = await ApplicationModel
      .find()
      .populate({
        path: "studentID",
        populate: {
          path: "userID"
        }
      })
      .populate({
        path: "jobID",
        populate: {
          path: "companyID"
        }
      });

    return res.status(200).json({
      success: true,
      applications
    });

  } catch (err) {
    next(err);
  }
};
const updateApplicationStatus = async (req, res, next) => {
  try {

    const { applicationID } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Selected",
      "Rejected"
    ];

    // Check status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    // Find application
    const application = await ApplicationModel.findById(
      applicationID
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    const oldStatus = application.status;

if (oldStatus === status) {
  return res.status(400).json({
    success: false,
    message: `Application is already ${status}`
  });
}

    // Update application status
    application.status = status;

    await application.save();


    // ==========================================
    // FIND STUDENT
    // ==========================================

    const student = await StudentModel.findById(
      application.studentID
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }


    // ==========================================
    // CREATE NOTIFICATION MESSAGE
    // ==========================================

    let message = "";

    if (status === "Shortlisted") {

      message =
        "Your application has been shortlisted.";

    } else if (status === "Selected") {

      message =
        "Congratulations! You have been selected.";

    } else if (status === "Rejected") {

      message =
        "Your application has been rejected.";

    } else if (status === "Applied") {

      message =
        "Your application status has been changed to Applied.";

    }


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    await NotificationModel.create({

      userID: student.userID,

      message: message,

      type: "application"

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({

      success: true,

      message: "Application status updated successfully",

      application

    });

  } catch (err) {

    next(err);

  }
};
const getDashboardStats = async (req, res, next) => {
  try {

    // Find logged-in student's profile
    const student = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    // Count all available jobs
    const availableJobs = await JobModel.countDocuments({
      deadline: { $gte: new Date() }
    });

    // Count student's applications
    const appliedJobs = await ApplicationModel.countDocuments({
      studentID: student._id
    });

    // Count selected applications
    const selected = await ApplicationModel.countDocuments({
      studentID: student._id,
      status: "Selected"
    });

    return res.status(200).json({
      success: true,
      availableJobs,
      appliedJobs,
      selected
    });

  } catch (err) {
    next(err);
  }
};
module.exports = {
  applyJob,getMyApplications,getAllApplications, updateApplicationStatus,getDashboardStats 
};