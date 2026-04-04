const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: {
                values: ["new_order", "low_stock", "new_testimonial", "order_canceled"],
                message: "Invalid notification type: {VALUE}",
            },
            required: [true, "Notification type is required"],
        },
        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Notification message is required"],
            trim: true,
        },
        isRead: { type: Boolean, default: false },
        ref: { type: mongoose.Schema.Types.ObjectId, refPath: "refModel" },
        refModel: {
            type: String,
            enum: {
                values: ["Order", "Product", "Testimonial"],
                message: "Invalid ref model: {VALUE}",
            },
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
