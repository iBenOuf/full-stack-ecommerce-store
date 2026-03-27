const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
            maxlength: [500, "Question cannot exceed 500 characters"],
        },
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
            maxlength: [2000, "Answer cannot exceed 2000 characters"],
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("FAQ", faqSchema);
