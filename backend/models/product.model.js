const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Product slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        stockQuantity: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock quantity cannot be negative"],
            default: 0,
        },
        imageUrl: {
            type: String,
            required: [true, "Product image is required"],
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Subcategory is required"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false,
        },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

productSchema.index({ isActive: 1, isDeleted: 1 });
productSchema.index({ subcategory: 1, isActive: 1, isDeleted: 1 });
productSchema.index({ category: 1, isActive: 1, isDeleted: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ stockQuantity: 1 });

productSchema.pre("save", async function () {
    if (this.isModified("subcategory")) {
        const Subcategory = mongoose.model("Subcategory");
        const subcat = await Subcategory.findById(this.subcategory);

        if (subcat && subcat.category) {
            this.category = subcat.category;
        } else {
            throw new Error(
                "The selected subcategory does not have a valid parent category.",
            );
        }
    }
});

module.exports = mongoose.model("Product", productSchema);
