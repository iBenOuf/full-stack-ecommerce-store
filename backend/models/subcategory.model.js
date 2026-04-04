const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subcategory name is required"],
            trim: true,
            maxlength: [50, "Subcategory name cannot exceed 50 characters"],
        },
        slug: {
            type: String,
            required: [true, "Subcategory slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Parent category is required"],
        },
        image: { type: String },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

subcategorySchema.index({ category: 1, isActive: 1, isDeleted: 1 });
subcategorySchema.index({ slug: 1 });
subcategorySchema.index({ isActive: 1, isDeleted: 1 });

module.exports = mongoose.model("Subcategory", subcategorySchema);
