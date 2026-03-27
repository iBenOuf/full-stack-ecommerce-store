const mongoose = require("mongoose");
const { isCorrectPassword, encryptPassword } = require("../utils/bcrypt.utils");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [1, "First name cannot be empty"],
            maxlength: [30, "First name cannot exceed 30 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [1, "Last name cannot be empty"],
            maxlength: [30, "Last name cannot exceed 30 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
        },
        role: {
            type: String,
            enum: {
                values: ["customer", "moderator", "admin"],
                message: "Role must be customer, moderator, or admin",
            },
            default: "customer",
        },
        phone: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female"],
                message: "Gender must be male or female",
            },
            default: "male",
        },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.pre("save", encryptPassword);
userSchema.methods.isCorrectPassword = isCorrectPassword;

module.exports = mongoose.model("User", userSchema);
