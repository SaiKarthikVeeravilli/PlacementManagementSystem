const mongoose=require('mongoose');
const CompanyModel=require('../Models/CompanyModel');
const JobModel = require('../Models/JobModel');
const addCompany=async(req,res,next)=>{
  try{
    const {
    companyname,
    description,
    industry,
    location,
    website,
    logo

    }=req.body;
    const company=await CompanyModel. create(req.body);
    return res.status(201).json({
      success:true,
      message:"Company added successfully"
    })
  }
  catch(err){
    next(err);
  }
}
const get_company=async(req,res,next)=>{
  try{
    const company=await CompanyModel.find();
    return res.status(200).json({
      success:true,
      company
    })
  }
  catch(err){
    next(err);
  }
}
const updateCompany = async (req, res, next) => {
  try {

    const {
      companyname,
      description,
      industry,
      location,
      website,
      logo
    } = req.body;

    const company = await CompanyModel.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    company.companyname = companyname;
    company.description = description;
    company.industry = industry;
    company.location = location;
    company.website = website;
    company.logo = logo;

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company
    });

  } catch (err) {
    next(err);
  }
};
const deleteCompany = async (req, res, next) => {
  try {

    const company = await CompanyModel.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    // Check whether this company has jobs
    const jobs = await JobModel.findOne({
      companyID: company._id
    });

    if (jobs) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete company because jobs are associated with it"
      });
    }

    await CompanyModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};
module.exports={addCompany,get_company,updateCompany,deleteCompany};