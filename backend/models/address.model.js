const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        label: {
            type: String,
            default: "Home",
            trim: true,
            maxlength: [30, "Label cannot exceed 30 characters"],
        },
        street: {
            type: String,
            required: [true, "Street is required"],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        governorate: {
            type: String,
            required: [true, "Governorate is required"],
            trim: true,
        },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Address", addressSchema);
