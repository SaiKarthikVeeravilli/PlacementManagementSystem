const Authcontroller=require('../Controllers/AuthController');
const express=require('express');
const AuthMiddleware=require('../Middlewares/AuthMidlleware');
const UploadMiddleware=require('../Middlewares/UploadMiddleware');
const rateLimit = require("express-rate-limit");
const router=express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});
router.post('/signup',authLimiter,Authcontroller.post_signup);
router.post('/login',authLimiter,Authcontroller.post_login);
router.get('/me',AuthMiddleware,Authcontroller.me);
router.get('/logout',Authcontroller.logout);
//student related..
router.get('/profile',AuthMiddleware,Authcontroller.profile_check);
router.post('/student/profile',AuthMiddleware,UploadMiddleware.single('resume') ,Authcontroller.Add_Student);
router.put( '/student/profile/:id',AuthMiddleware,UploadMiddleware.single('resume'),Authcontroller.update_Student);
router.get( "/student/resume",AuthMiddleware,Authcontroller.view_resume);
router.put( "/student/change-password",AuthMiddleware,Authcontroller.changePassword);
router.post(  "/forgot-password", authLimiter, Authcontroller.forgotPassword);

router.post( "/reset-password/:token", Authcontroller.resetPassword);
router.put(
  "/settings/notifications",
  AuthMiddleware,
  Authcontroller.updateNotificationSettings
);
module.exports=router;