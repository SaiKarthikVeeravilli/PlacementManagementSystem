const express=require('express');
const AdminMiddleware=require('../Middlewares/AdminMiddleware');
const router2=express.Router();
const CompanyController=require('../Controllers/CompanyController');
router2.post('/addcompany',AdminMiddleware,CompanyController.addCompany);
router2.get('/getcompany',CompanyController.get_company);
router2.put(
  '/editcompany/:id',
  AdminMiddleware,
  CompanyController.updateCompany
);
router2.delete(
  '/deletecompany/:id',
  AdminMiddleware,
  CompanyController.deleteCompany
);

module.exports=router2;