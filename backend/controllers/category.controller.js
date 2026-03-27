const Category = require("../models/category.model");
const Joi = require("joi");
const { getCache, setCache, clearPrefix } = require("../utils/cache.utils");

const CACHE_PREFIX = "categories_";

exports.getAllCategories = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const cacheKey = `${CACHE_PREFIX}all_${adminOnly}`;
        const cached = getCache(cacheKey);
        if (cached) {
            return res.status(200).json({
                message: "Categories fetched successfully (cached)",
                data: cached,
            });
        }

        const selectFields = adminOnly ? "-__v" : "-__v -isDeleted";
        const categories = await Category.find({
            ...(!adminOnly && { isDeleted: false }),
        }).select(selectFields);

        setCache(cacheKey, categories, 3600); // 1h

        res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
        });
    };
};
exports.getCategoryBySlug = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const slug = req.params.slug;
        const selectFields = adminOnly ? "-__v" : "-__v -isDeleted";
        const category = await Category.findOne({
            slug,
            ...(!adminOnly && { isDeleted: false }),
        }).select(selectFields);
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        res.status(200).json({
            message: "Category fetched successfully",
            data: category,
        });
    };
};

exports.getCategoryById = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const categoryId = req.params.id;
        const selectFields = adminOnly ? "-__v" : "-__v -isDeleted";
        const category = await Category.findOne({
            _id: categoryId,
            ...(!adminOnly && { isDeleted: false }),
        }).select(selectFields);
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        res.status(200).json({
            message: "Category fetched successfully",
            data: category,
        });
    };
};

const createCategorySchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    slug: Joi.string().min(1).max(50).trim().required(),
});

exports.createCategory = async (req, res) => {
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Category image is required" });
    }
    const { name, slug } = value;
    const slugExists = await Category.findOne({ slug });
    if (slugExists) {
        return res.status(409).json({
            message: "Category with this slug already exists",
        });
    }
    const imageUrl = req.file.filename;
    const category = await Category.create({
        name,
        slug,
        imageUrl,
    });

    clearPrefix(CACHE_PREFIX);

    res.status(201).json({
        message: "Category created successfully",
        data: category,
    });
};

const updateCategorySchema = Joi.object({
    name: Joi.string().min(1).max(50).optional(),
    slug: Joi.string().min(1).max(50).trim().optional(),
});
exports.updateCategory = async (req, res) => {
    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }
    if (Object.keys(value).length === 0 && !req.file) {
        return res.status(400).json({
            message: "No data provided to update",
        });
    }
    const { name, slug } = value;
    const categoryId = req.params.id;
    if (slug) {
        const slugExists = await Category.findOne({
            slug,
            _id: { $ne: categoryId },
        });
        if (slugExists) {
            return res.status(409).json({
                message: "Category with this slug already exists",
            });
        }
    }

    const updateData = {
        ...(name && { name }),
        ...(slug && { slug }),
    };
    if (req.file) {
        updateData.imageUrl = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    clearPrefix(CACHE_PREFIX);

    res.status(200).json({
        message: "Category updated successfully",
        data: category,
    });
};

exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            isDeleted: true,
        },
        { new: true, runValidators: true },
    );
    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    clearPrefix(CACHE_PREFIX);

    res.status(200).json({
        message: "Category deleted successfully",
        data: category,
    });
};
