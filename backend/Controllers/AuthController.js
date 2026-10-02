const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const StudentModel = require("../Models/StudentModel");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");

// ==========================================
// USER SIGNUP
// ==========================================

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


// ==========================================
// TOKEN CREATION
// ==========================================

const create_token = (id) => {
    return jwt.sign(
        { id },
        process.env.SECRET,
        {
            expiresIn: "1d",
        }
    );
};


// ==========================================
// LOGIN
// ==========================================

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

        const normalizedEmail = email.trim().toLowerCase();

        // Password is select:false in UserModel
        const found = await userModel
            .findOne({ email: normalizedEmail })
            .select("+password");

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
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


// ==========================================
// LOGGED-IN USER
// ==========================================

const me = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
};


// ==========================================
// LOGOUT
// ==========================================

const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "logged out successfully",
        });

    } catch (err) {
        next(err);
    }
};


// ==========================================
// CHECK STUDENT PROFILE
// ==========================================

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


// ==========================================
// ADD STUDENT PROFILE
// ==========================================

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

        // Default resume data
        let resumeData = {
            filename: "",
            filepath: "",
            uploadedAt: null,
        };

        // If resume was uploaded to Cloudinary
        if (req.file) {
            resumeData = {
                filename: req.file.originalname,
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

            skills: (skills || "")
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


// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================

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

        profile.skills = (skills || "")
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        profile.github = github;
        profile.linkedin = linkedin;


        // ==========================================
        // RESUME REPLACEMENT
        // ==========================================

        if (req.file) {

            // Delete old resume from Cloudinary
            if (
                profile.resume &&
                profile.resume.filepath
            ) {
                try {
                    const oldUrl = profile.resume.filepath;

                    const uploadMarker = "/upload/";
                    const uploadIndex = oldUrl.indexOf(uploadMarker);

                    if (uploadIndex !== -1) {

                        let publicId = oldUrl.substring(
                            uploadIndex + uploadMarker.length
                        );

                        // Remove Cloudinary version
                        publicId = publicId.replace(
                            /^v\d+\//,
                            ""
                        );

                        // Remove file extension
                        publicId = publicId.replace(
                            /\.[^/.]+$/,
                            ""
                        );

                        await cloudinary.uploader.destroy(
                            publicId,
                            {
                                resource_type: "image",
                            }
                        );
                    }

                } catch (deleteError) {
                    console.log(
                        "Old resume could not be deleted from Cloudinary:",
                        deleteError.message
                    );
                }
            }


            // Save new Cloudinary resume
            profile.resume = {
                filename: req.file.originalname,
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


// ==========================================
// VIEW / DOWNLOAD RESUME
// ==========================================

const view_resume = async (req, res, next) => {
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

        if (
            !profile.resume ||
            !profile.resume.filepath
        ) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        return res.redirect(
            profile.resume.filepath
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
            confirmPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        // Password is select:false, so explicitly include it
        const user = await userModel
            .findById(req.user._id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.password = newPassword;

        // pre-save middleware hashes the new password
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (err) {
        next(err);
    }
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await userModel.findOne({
            email: normalizedEmail,
        });

        /*
         * Always return the same response whether
         * the email exists or not.
         *
         * This prevents email/account enumeration.
         */
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a password reset link has been sent",
            });
        }


        // Generate secure random token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");


        // Store only the hash in database
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");


        user.resetPasswordToken = hashedResetToken;

        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();


        // Raw token goes only to the user through email
        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


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

            <p>
                If you did not request this, ignore this email.
            </p>
        `;


        await sendEmail(
            user.email,
            "Placement Management - Password Reset",
            html
        );


        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a password reset link has been sent",
        });

    } catch (err) {
        next(err);
    }
};


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;

        const {
            newPassword,
            confirmPassword,
        } = req.body;


        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }


        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }


        // Hash token received from URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


        // Reset fields are select:false,
        // so explicitly include them.
        const user = await userModel
            .findOne({
                resetPasswordToken: hashedToken,

                resetPasswordExpires: {
                    $gt: Date.now(),
                },
            })
            .select(
                "+resetPasswordToken +resetPasswordExpires"
            );


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }


        // Set new password
        // UserModel pre-save middleware hashes it.
        user.password = newPassword;


        // Invalidate reset token immediately
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (err) {
        next(err);
    }
};


// ==========================================
// NOTIFICATION SETTINGS
// ==========================================

const updateNotificationSettings = async (
    req,
    res,
    next
) => {
    try {
        const { notificationsEnabled } = req.body;

        const user = await userModel.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.notificationsEnabled =
            notificationsEnabled;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Notification settings updated",
            notificationsEnabled:
                user.notificationsEnabled,
        });

    } catch (err) {
        next(err);
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    post_signup,
    post_login,
    me,
    logout,
    profile_check,
    Add_Student,
    update_Student,
    view_resume,
    changePassword,
    forgotPassword,
    resetPassword,
    updateNotificationSettings,
};