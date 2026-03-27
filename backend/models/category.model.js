const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        imageUrl: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
