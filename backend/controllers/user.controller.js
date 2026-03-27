const User = require("../models/user.model");
const Joi = require("joi");

exports.getAllUsers = async (req, res) => {
    const users = await User.find().select("-password -__v");
    res.status(200).json({
        message: "Users fetched successfully",
        data: users,
    });
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    const role = req.user.role;
    const reqUserId = req.user._id.toString();
    
    if (userId !== reqUserId && role !== "admin") {
        return res
            .status(403)
            .json({ message: "You are not authorized to fetch this user" });
    }
    const selectFields =
        role === "admin"
            ? "-password -__v"
            : "-password -__v -isDeleted -isActive";
    const user = await User.findById(userId).select(selectFields);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", data: user });
};

const updateUserInfoSchema = Joi.object({
    firstName: Joi.string().min(1).max(30).optional(),
    lastName: Joi.string().min(1).max(30).optional(),
    phone: Joi.string()
        .pattern(/^[0-9+\-\s]{10,15}$/)
        .optional(),
    gender: Joi.string().valid("male", "female").optional(),
});

exports.updateUserInfo = async (req, res) => {
    const { error, value } = updateUserInfoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { firstName, lastName, phone, gender } = value;
    if (Object.keys(value).length === 0) {
        return res.status(400).json({ message: "No data provided" });
    }
    const userId = req.params.id;
    const reqUserId = req.user._id.toString();
    if (userId !== reqUserId) {
        return res
            .status(403)
            .json({ message: "You are not authorized to update this user" });
    }
    const user = await User.findOneAndUpdate(
        { _id: userId },
        {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(gender && { gender }),
        },
        { new: true, runValidators: true },
    ).select("-password -__v -isDeleted -isActive");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", data: user });
};

const changeUserStatusSchema = Joi.object({
    isActive: Joi.boolean().required(),
});

exports.changeUserStatus = async (req, res) => {
    const { error, value } = changeUserStatusSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { isActive } = value;
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, runValidators: true },
    ).select("-password -__v");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User status changed successfully",
        data: user,
    });
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true, runValidators: true },
    ).select("-password -__v");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", data: user });
};

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(32).required(),
});

exports.updatePassword = async (req, res) => {
    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { currentPassword, newPassword } = value;
    const userId = req.params.id;
    const reqUserId = req.user._id.toString();
    if (userId !== reqUserId) {
        return res
            .status(403)
            .json({ message: "You are not authorized to update this user" });
    }
    const user = await User.findById(userId).select(
        " -__v -isDeleted -isActive",
    );
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const isCorrectPassword = await user.isCorrectPassword(currentPassword);
    if (!isCorrectPassword) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    user.password = newPassword;
    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    res.status(200).json({
        message: "Password updated successfully",
        data: userObject,
    });
};
