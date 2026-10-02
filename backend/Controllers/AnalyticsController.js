const StudentModel = require("../Models/StudentModel");
const CompanyModel = require("../Models/CompanyModel");
const JobModel = require("../Models/JobModel");
const ApplicationModel = require("../Models/ApplicationModel");


// ======================================================
// ADMIN → PLACEMENT ANALYTICS
// ======================================================

const getAnalytics = async (req, res, next) => {

  try {

    // ==================================================
    // 1. OVERVIEW
    // ==================================================

    const totalStudents =
      await StudentModel.countDocuments();


    const totalCompanies =
      await CompanyModel.countDocuments();


    const totalJobs =
      await JobModel.countDocuments();


    const activeJobs =
      await JobModel.countDocuments({
        deadline: {
          $gte: new Date()
        }
      });


    const totalApplications =
      await ApplicationModel.countDocuments();


    const selectedStudents =
      await ApplicationModel.countDocuments({
        status: "Selected"
      });


    // ==================================================
    // 2. APPLICATION STATUS
    // ==================================================

    const applied =
      await ApplicationModel.countDocuments({
        status: "Applied"
      });


    const shortlisted =
      await ApplicationModel.countDocuments({
        status: "Shortlisted"
      });


    const selected =
      await ApplicationModel.countDocuments({
        status: "Selected"
      });


    const rejected =
      await ApplicationModel.countDocuments({
        status: "Rejected"
      });


    // ==================================================
    // 3. BRANCH-WISE STUDENTS
    // ==================================================

    const branchStats =
      await StudentModel.aggregate([

        {
          $group: {

            _id: "$branch",

            students: {
              $sum: 1
            }

          }
        },

        {
          $sort: {
            students: -1
          }
        }

      ]);


    // ==================================================
    // 4. COMPANY-WISE SELECTED STUDENTS
    // ==================================================

    const companyStats =
      await ApplicationModel.aggregate([

        // Only selected applications
        {
          $match: {
            status: "Selected"
          }
        },


        // Application → Job
        {
          $lookup: {

            from: "jobs",

            localField: "jobID",

            foreignField: "_id",

            as: "job"

          }
        },


        // Convert job array into object
        {
          $unwind: "$job"
        },


        // Job → Company
        {
          $lookup: {

            from: "companies",

            localField: "job.companyID",

            foreignField: "_id",

            as: "company"

          }
        },


        // Convert company array into object
        {
          $unwind: "$company"
        },


        // Group selected students by company
        {
          $group: {

            _id: "$company._id",

            companyName: {
              $first: "$company.companyname"
            },

            selected: {
              $sum: 1
            }

          }
        },


        // Highest selections first
        {
          $sort: {
            selected: -1
          }
        }

      ]);


    // ==================================================
    // 5. PACKAGE STATISTICS
    // ==================================================

    const packageStats =
      await JobModel.aggregate([

        {
          $group: {

            _id: null,

            averagePackage: {
              $avg: "$package"
            },

            highestPackage: {
              $max: "$package"
            },

            lowestPackage: {
              $min: "$package"
            }

          }
        }

      ]);


    // ==================================================
    // 6. APPLICATION TRENDS
    // ==================================================

    const applicationTrends =
      await ApplicationModel.aggregate([

        {
          $group: {

            _id: {

              $dateToString: {

                format: "%Y-%m-%d",

                date: "$createdAt"

              }

            },

            applications: {
              $sum: 1
            }

          }
        },


        {
          $sort: {
            _id: 1
          }
        }

      ]);


    // ==================================================
    // 7. RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,


      // ------------------------------
      // Overview
      // ------------------------------

      overview: {

        totalStudents,

        totalCompanies,

        totalJobs,

        activeJobs,

        totalApplications,

        selectedStudents

      },


      // ------------------------------
      // Application Status
      // ------------------------------

      applicationStatus: {

        applied,

        shortlisted,

        selected,

        rejected

      },


      // ------------------------------
      // Branch Statistics
      // ------------------------------

      branchStats,


      // ------------------------------
      // Company Statistics
      // ------------------------------

      companyStats,


      // ------------------------------
      // Package Statistics
      // ------------------------------

      packageStats:
        packageStats[0] || {

          averagePackage: 0,

          highestPackage: 0,

          lowestPackage: 0

        },


      // ------------------------------
      // Application Trends
      // ------------------------------

      applicationTrends

    });

  } catch (err) {

    next(err);

  }

};


module.exports = {
  getAnalytics
};