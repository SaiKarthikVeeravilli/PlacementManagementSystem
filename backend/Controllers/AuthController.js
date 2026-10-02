const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const StudentModel = require("../Models/StudentModel");
const fs = require("fs");
const sendEmail = require("../Utils/sendEmail");
const crypto=require('crypto');

// User signup
const post_signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    await userModel.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Token creation
const create_token = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Login
const post_login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let errors = {};

    if (!email) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    const found = await userModel.findOne({ email });

    if (!found) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const valid = await bcrypt.compare(
      password,
      found.password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = create_token(found._id);

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
});

    return res.status(200).json({
      success: true,
      message: "Login successful",
      _id: found._id,
    });
  } catch (err) {
    next(err);
  }
};

// Logged-in user
const me = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Logout
const logout = async (req, res, next) => {
  try {
    // res.clearCookie("jwt");
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
});

    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Check student profile
const profile_check = async (req, res, next) => {
  try {
    const profile = await StudentModel.findOne({
      userID: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// Add student profile
const Add_Student = async (req, res, next) => {
  try {
    const {
      phoneno,
      gender,
      collegename,
      branch,
      currentyear,
      currentsemester,
      cgpa,
      percentage10th,
      percentage12th,
      activebacklogs,
      passingyear,
      skills,
      github,
      linkedin,
    } = req.body;

    const alreadyExists = await StudentModel.findOne({
      userID: req.user._id,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    let resumeData = {
      filename: "",
      filepath: "",
      uploadedAt: null,
    };

    // If resume was uploaded
    if (req.file) {
      resumeData = {
        filename: req.file.filename,
        filepath: req.file.path,
        uploadedAt: new Date(),
      };
    }

    await StudentModel.create({
      userID: req.user._id,
      phoneno,
      gender,
      collegename,
      branch,
      currentyear,
      currentsemester,
      cgpa,
      percentage10th,
      percentage12th,
      activebacklogs,
      passingyear,

      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),

      github,
      linkedin,

      resume: resumeData,
    });

    return res.status(201).json({
      success: true,
      message: "Profile Created Successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update student profile
const update_Student = async (req, res, next) => {
  try {
    const {
      phoneno,
      gender,
      collegename,
      branch,
      currentyear,
      currentsemester,
      cgpa,
      percentage10th,
      percentage12th,
      activebacklogs,
      passingyear,
      skills,
      github,
      linkedin,
    } = req.body;

   

    const profile = await StudentModel.findOne({
      _id: req.params.id,
      userID: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.phoneno = phoneno;
    profile.gender = gender;
    profile.collegename = collegename;
    profile.branch = branch;
    profile.currentyear = currentyear;
    profile.currentsemester = currentsemester;
    profile.cgpa = cgpa;
    profile.percentage10th = percentage10th;
    profile.percentage12th = percentage12th;
    profile.activebacklogs = activebacklogs;
    profile.passingyear = passingyear;

    profile.skills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    profile.github = github;
    profile.linkedin = linkedin;

    // Resume replacement
    if (req.file) {

      // Delete old resume
      if (
        profile.resume &&
        profile.resume.filepath
      ) {
        fs.unlink(
          profile.resume.filepath,
          (err) => {
            if (err) {
              console.log(
                "Old resume could not be deleted:",
                err.message
              );
            } else {
              console.log(
                "Old resume deleted successfully"
              );
            }
          }
        );
      }

      // Save new resume information
      profile.resume = {
        filename: req.file.filename,
        filepath: req.file.path,
        uploadedAt: new Date(),
      };
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (err) {
    next(err);
  }
};
// View / Download Resume
const view_resume = async (req, res, next) => {
  try {

    const profile = await StudentModel.findOne({
      userID: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    if (
      !profile.resume ||
      !profile.resume.filepath
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const filePath = profile.resume.filepath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file does not exist"
      });
    }

    res.sendFile(
      require("path").resolve(filePath)
    );

  } catch (err) {
    next(err);
  }
};
// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res, next) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;


    // 1. Check all fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });

    }


    // 2. Check new password and confirm password
    if (newPassword !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });

    }


    // 3. Find logged-in user
    const user = await userModel.findById(
      req.user._id
    );


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }


    // 4. Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );


    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });

    }


    // 5. Save new password
    user.password = newPassword;

    await user.save();


    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });


  } catch (err) {

    next(err);

  }

};
const forgotPassword = async (req, res, next) => {

  try {

    const { email } = req.body;

    // 1. Check email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // 2. Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3. Generate secure token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

  
    // 4. Save token
    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

  

    await user.save();


    // 5. Create reset link
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    // 6. Email content
    const html = `
      <h2>Password Reset</h2>

      <p>You requested to reset your password.</p>

      <p>Click the button below:</p>

      <a href="${resetLink}"
         style="
           display:inline-block;
           padding:10px 20px;
           background:#2563eb;
           color:white;
           text-decoration:none;
           border-radius:5px;
         ">
         Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>

      <p>If you did not request this, ignore this email.</p>
    `;

    // 7. Send email
   

    await sendEmail(
      user.email,
      "Placement Management - Password Reset",
      html
    );


    // 8. Send response to frontend
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });

  } catch (err) {

    next(err);

  }

};
const resetPassword = async (req, res, next) => {

  try {

    const { token } = req.params;

    const {
      newPassword,
      confirmPassword
    } = req.body;


    // Check passwords
    if (!newPassword || !confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });

    }


    // Check passwords match
    if (newPassword !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });

    }


    // Find user using token
    const user = await userModel.findOne({

      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now()
      }

    });


    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });

    }


    // Set new password
    user.password = newPassword;


    // Remove token
    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;



try {

  await user.save();



} catch (err) {


  return res.status(500).json({
    success: false,
    message: err.message
  });

}


    return res.status(200).json({

      success: true,

      message: "Password reset successfully"

    });


  } catch (err) {

    next(err);

  }

};
const updateNotificationSettings = async (req, res, next) => {
  try {
    const { notificationsEnabled } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.notificationsEnabled = notificationsEnabled;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification settings updated",
      notificationsEnabled: user.notificationsEnabled
    });

  } catch (err) {
    next(err);
  }
};
module.exports = {
  post_signup,
  post_login,
  me,
  logout,
  profile_check,
  Add_Student,
  update_Student,
  view_resume,changePassword,forgotPassword,resetPassword,updateNotificationSettings
};