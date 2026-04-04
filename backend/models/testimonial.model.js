const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "approved", "rejected"],
                message: "Status must be pending, approved, or rejected",
            },
            default: "pending",
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

testimonialSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });
testimonialSchema.index({ user: 1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
