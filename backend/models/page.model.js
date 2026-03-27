const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
    {
        pageSlug: {
            type: String,
            required: [true, "Page slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: [true, "Page title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Page content is required"],
            trim: true,
        },
        isDeleted: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Page", pageSchema);
