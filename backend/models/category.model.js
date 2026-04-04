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
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

categorySchema.index({ isActive: 1, isDeleted: 1 });
categorySchema.index({ slug: 1 });

module.exports = mongoose.model("Category", categorySchema);
