const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Joi = require("joi");
const { clearPrefix } = require("../utils/cache.utils");
const { deleteFromCloudinary, extractPublicIdFromUrl } = require("../utils/cloudinary");
const { createNotification } = require("../utils/notification.utils");

const PRODUCT_LIST_CACHE_PREFIX = "products_list_";

const createProductSchema = Joi.object({
    name: Joi.string().min(1).max(200).required(),
    slug: Joi.string().min(1).max(200).trim().required(),
    description: Joi.string().min(1).max(2000).required(),
    price: Joi.number().min(0).required(),
    stockQuantity: Joi.number().integer().min(0).required(),
    subcategoryId: Joi.string().required(),
});

exports.createProduct = async (req, res) => {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Product image is required" });
    }
    const { name, slug, description, price, stockQuantity, subcategoryId } =
        value;

    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
        return res
            .status(409)
            .json({ message: "Product with this slug already exists" });
    }

    const imageUrl = req.file.path; // Cloudinary URL
    const product = await Product.create({
        name,
        slug,
        description,
        price,
        stockQuantity,
        imageUrl,
        subcategory: subcategoryId,
    });

    const populatedProduct = await Product.findById(product._id).populate(
        "subcategory",
    );

    if (stockQuantity <= 5) {
        await createNotification(
            "low_stock",
            "Low Stock Alert",
            `Product ${name} has low stock (${stockQuantity} left).`,
            product._id,
            "Product",
        );
    }

    clearPrefix(PRODUCT_LIST_CACHE_PREFIX);

    res.status(201).json({
        message: "Product created successfully",
        data: populatedProduct,
    });
};

exports.getProductBySlug = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug,
            ...(!adminOnly && { isActive: true, isDeleted: false }),
        }).populate("subcategory");
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            data: product,
        });
    };
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("subcategory");
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }
    res.status(200).json({
        message: "Product fetched successfully",
        data: product,
    });
};

exports.getBestSellerProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const bestSellers = await Order.aggregate([
        {
            $match: {
                status: { $in: ["preparing", "shipped", "delivered"] },
            },
        },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                totalSold: { $sum: "$items.quantity" },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $match: {
                "product.isActive": true,
                "product.isDeleted": false,
            },
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "product.subcategory",
                foreignField: "_id",
                as: "product.subcategory",
            },
        },
        {
            $unwind: {
                path: "$product.subcategory",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$product", { totalSold: "$totalSold" }],
                },
            },
        },
    ]);

    if (bestSellers.length === 0) {
        return res
            .status(200)
            .json({ message: "No best seller products found", data: [] });
    }

    res.status(200).json({
        message: "Best seller products fetched successfully",
        data: bestSellers,
    });
};

exports.getRelatedProducts = async (req, res) => {
    const { productId, subcategoryId } = req.query;
    if (!productId || !subcategoryId) {
        return res.status(400).json({
            message: "productId and subcategoryId query params are required",
        });
    }
    const relatedProducts = await Product.find({
        subcategory: subcategoryId,
        _id: { $ne: productId },
        isActive: true,
        isDeleted: false,
    })
        .limit(4)
        .populate("subcategory");
    if (relatedProducts.length === 0) {
        return res.status(404).json({
            message: "Related products not found",
        });
    }
    res.status(200).json({
        message: "Related products fetched successfully",
        data: relatedProducts,
    });
};

exports.deleteProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    // Delete image from Cloudinary
    if (product.imageUrl) {
        const publicId = extractPublicIdFromUrl(product.imageUrl);
        await deleteFromCloudinary(publicId);
    }

    const deletedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            isDeleted: true,
            isActive: false,
        },
        {
            new: true,
            runValidators: true,
        },
    ).populate("subcategory");

    clearPrefix(PRODUCT_LIST_CACHE_PREFIX);
    res.status(200).json({
        message: "Product deleted successfully",
        data: deletedProduct,
    });
};

const updateProductSchema = Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    slug: Joi.string().min(1).max(200).trim().optional(),
    description: Joi.string().min(1).max(2000).optional(),
    price: Joi.number().min(0).optional(),
    stockQuantity: Joi.number().integer().min(0).optional(),
    subcategoryId: Joi.string().optional(),
});

exports.updateProductById = async (req, res) => {
    const { error, value } = updateProductSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const productId = req.params.id;
    const { name, slug, description, price, stockQuantity, subcategoryId } =
        value;

    if (slug) {
        const slugExists = await Product.findOne({
            slug,
            _id: { $ne: productId },
        });
        if (slugExists) {
            return res
                .status(409)
                .json({ message: "Product with this slug already exists" });
        }
    }

    const updateData = {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(stockQuantity !== undefined && { stockQuantity }),
        ...(subcategoryId && { subcategory: subcategoryId }),
    };

    if (req.file) {
        // Delete old image from Cloudinary
        const existingProduct = await Product.findById(productId);
        if (existingProduct && existingProduct.imageUrl) {
            const oldPublicId = extractPublicIdFromUrl(existingProduct.imageUrl);
            await deleteFromCloudinary(oldPublicId);
        }
        updateData.imageUrl = req.file.path; // Cloudinary URL
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data provided to update" });
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
    }).populate("subcategory");
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    if (stockQuantity !== undefined && stockQuantity <= 5) {
        await createNotification(
            "low_stock",
            "Low Stock Alert",
            `Product ${product.name} has low stock (${stockQuantity} left).`,
            product._id,
            "Product",
        );
    }

    clearPrefix(PRODUCT_LIST_CACHE_PREFIX);
    res.status(200).json({
        message: "Product updated successfully",
        data: product,
    });
};

exports.getPaginatedProducts = (req, res) => {
    res.status(200).json({
        message: "Products fetched successfully",
        data: res.paginatedData,
    });
};
