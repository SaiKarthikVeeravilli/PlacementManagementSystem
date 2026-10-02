const StudentModel = require("../Models/StudentModel");
const CompanyModel = require("../Models/CompanyModel");
const JobModel = require("../Models/JobModel");
const ApplicationModel = require("../Models/ApplicationModel");

const getAdminDashboardStats = async (req, res, next) => {
  try {

    const totalStudents = await StudentModel.countDocuments();

    const totalCompanies = await CompanyModel.countDocuments();

    const activeJobs = await JobModel.countDocuments({
      deadline: { $gte: new Date() }
    });

    const totalApplications = await ApplicationModel.countDocuments();

    const selectedStudents = await ApplicationModel.countDocuments({
      status: "Selected"
    });

    return res.status(200).json({
      success: true,
      totalStudents,
      totalCompanies,
      activeJobs,
      totalApplications,
      selectedStudents
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminDashboardStats
};