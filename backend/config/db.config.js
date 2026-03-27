const mongoose = require("mongoose");
const seedAdmin = require("../utils/seed-admin.utils");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`database connected: ${conn.connection.host}`);
        await seedAdmin();
    } catch (err) {
        console.error("database connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
