const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [6, "Name should contain minimum 6 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: [254, "Email cannot exceed 254 characters"],
            validate: [isEmail, "Enter valid Email"]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        resetPasswordToken: {
            type: String,
            default: null,
            select: false
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
            select: false
        },

        notificationsEnabled: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


// Hash password before saving
userSchema.pre("save", async function () {

    // Only hash when password is created or changed
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;