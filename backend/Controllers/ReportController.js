const StudentModel = require("../Models/StudentModel");
const CompanyModel = require("../Models/CompanyModel");
const JobModel = require("../Models/JobModel");
const ApplicationModel = require("../Models/ApplicationModel");
const PDFDocument = require("pdfkit");

// ==========================================
// ADMIN → PLACEMENT REPORT
// ==========================================

const getPlacementReport = async (req, res, next) => {
  try {

    // ======================================
    // 1. BASIC COUNTS
    // ======================================

    const totalStudents =
      await StudentModel.countDocuments();

    const totalCompanies =
      await CompanyModel.countDocuments();

    const totalJobs =
      await JobModel.countDocuments();

    const totalApplications =
      await ApplicationModel.countDocuments();


    // ======================================
    // 2. APPLICATION STATUS
    // ======================================

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


    // ======================================
    // 3. PACKAGE INFORMATION
    // ======================================

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


    // ======================================
    // 4. RESPONSE
    // ======================================

    return res.status(200).json({

      success: true,

      overview: {

        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications

      },

      applicationStatus: {

        applied,
        shortlisted,
        selected,
        rejected

      },

      packageStats:
        packageStats[0] || {

          averagePackage: 0,
          highestPackage: 0,
          lowestPackage: 0

        }

    });

  } catch (err) {

    next(err);

  }
};
const downloadPlacementReport = async (req, res, next) => {
  try {

    // Get required data
    const totalStudents =
      await StudentModel.countDocuments();

    const totalCompanies =
      await CompanyModel.countDocuments();

    const totalJobs =
      await JobModel.countDocuments();

    const totalApplications =
      await ApplicationModel.countDocuments();

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


    // Create PDF
    const doc = new PDFDocument();


    // Tell browser that this is a PDF
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=placement-report.pdf"
    );


    // Send PDF to browser
    doc.pipe(res);


    // ==============================
    // PDF CONTENT
    // ==============================

    doc
      .fontSize(22)
      .text("Placement Management System", {
        align: "center"
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("Placement Report", {
        align: "center"
      });

    doc.moveDown(2);


    // Overview

    doc
      .fontSize(15)
      .text("Overview");

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Total Students: ${totalStudents}`);

    doc
      .text(`Total Companies: ${totalCompanies}`);

    doc
      .text(`Total Jobs: ${totalJobs}`);

    doc
      .text(`Total Applications: ${totalApplications}`);


    doc.moveDown(2);


    // Application Status

    doc
      .fontSize(15)
      .text("Application Status");

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Applied: ${applied}`);

    doc
      .text(`Shortlisted: ${shortlisted}`);

    doc
      .text(`Selected: ${selected}`);

    doc
      .text(`Rejected: ${rejected}`);


    // Finish PDF

    doc.end();

  } catch (err) {

    next(err);

  }
};


module.exports = {
  getPlacementReport,
  downloadPlacementReport
};