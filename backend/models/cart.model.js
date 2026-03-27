const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
    },
    { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
