const User = require("../models/user.model");

const seedAdmin = async () => {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) return;

    await User.create({
        firstName: "Admin",
        lastName: "User",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
    });

    console.log("Default admin created from .env");
};

module.exports = seedAdmin;
