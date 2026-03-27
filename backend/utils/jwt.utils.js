const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    const { _id, role } = user;
    return jwt.sign(
        { _id, role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
