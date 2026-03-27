const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("CORS Policy: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
