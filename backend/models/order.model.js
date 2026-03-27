const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Product is required"],
                },
                quantity: {
                    type: Number,
                    required: [true, "Quantity is required"],
                    min: [1, "Quantity must be at least 1"],
                },
                unitPrice: {
                    type: Number,
                    required: [true, "Unit price is required"],
                    min: [0, "Unit price cannot be negative"],
                },
            },
        ],
        shippingAddress: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            governorate: { type: String, trim: true },
        },
        deliveryPhone: {
            type: String,
            required: [true, "Delivery phone is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: [
                    "pending",
                    "preparing",
                    "canceled_by_client",
                    "canceled_by_admin",
                    "shipped",
                    "delivered",
                    "rejected",
                    "returned",
                ],
                message: "Invalid order status: {VALUE}",
            },
            default: "pending",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
