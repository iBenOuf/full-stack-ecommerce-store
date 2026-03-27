const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt.utils");

exports.authenticate = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer"))
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = verifyAccessToken(token);
        const user = await User.findOne({
            _id: decodedToken._id,
            isActive: true,
            isDeleted: false,
        });
        if (!user)
            return res.status(404).json({ message: "Invalid user data" });
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
