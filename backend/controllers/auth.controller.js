const User = require("../models/user.model");
const { generateAccessToken } = require("../utils/jwt.utils");
const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
});
exports.login = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;
    const lowerCaseEmail = email.toLowerCase();

    const user = await User.findOne({
        email: lowerCaseEmail,
        isDeleted: false,
        isActive: true,
    });

    if (!user)
        return res.status(401).json({ message: "Invalid email or password" });

    const isCorrect = await user.isCorrectPassword(password);

    if (!isCorrect)
        return res.status(401).json({ message: "Invalid email or password" });

    const token = generateAccessToken(user);

    res.status(200).json({ message: "Logged in successfully", token });
};

const registerUserSchema = Joi.object({
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    phone: Joi.string()
        .pattern(/^[0-9+\-\s]{10,15}$/)
        .optional(),
    gender: Joi.string().valid("male", "female").optional(),
});
exports.registerUser = (role) => {
    return async (req, res) => {
        const { error, value } = registerUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { firstName, lastName, email, password, phone, gender } = value;
        const lowerCaseEmail = email.toLowerCase();
        const userExists = await User.findOne({ email: lowerCaseEmail });
        if (userExists) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const user = await User.create({
            firstName,
            lastName,
            email: lowerCaseEmail,
            password,
            role,
            ...(phone && { phone }),
            ...(gender && { gender }),
        });
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.isActive;
        delete userObject.isDeleted;
        delete userObject.__v;
        res.status(201).json({
            message: "Registered successfully",
            data: userObject,
        });
    };
};
exports.getMe = (req, res) => {
    const userObject = req.user.toObject();
    delete userObject.password;
    delete userObject.__v;
    res.status(200).json({ message: "User fetched successfully", data: userObject });
};
