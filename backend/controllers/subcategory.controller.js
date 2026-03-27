const Subcategory = require("../models/subcategory.model");
const Category = require("../models/category.model");
const Joi = require("joi");
const { getCache, setCache, clearPrefix } = require("../utils/cache.utils");

const CACHE_PREFIX = "subcategories_";

exports.getAllSubcategories = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const cacheKey = `${CACHE_PREFIX}all_${adminOnly}`;
        const cached = getCache(cacheKey);
        if (cached) {
            return res.status(200).json({
                message: "Subcategories fetched successfully (cached)",
                data: cached,
            });
        }

        const subcategories = await Subcategory.find({
            ...(!adminOnly && { isDeleted: false }),
        }).populate("category");

        setCache(cacheKey, subcategories, 3600); // 1h

        res.status(200).json({
            message: "Subcategories fetched successfully",
            data: subcategories,
        });
    };
};

exports.getAllSubcategoriesByCategorySlug = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const { slug } = req.query;
        if (!slug) {
            return res
                .status(400)
                .json({ message: "Category slug query param is required" });
        }

        const cacheKey = `${CACHE_PREFIX}byCategory_${slug}_${adminOnly}`;
        const cached = getCache(cacheKey);
        if (cached) {
            return res.status(200).json({
                message: "Subcategories fetched successfully (cached)",
                data: cached,
            });
        }

        const category = await Category.findOne({ slug });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const query = { category: category._id };
        if (!adminOnly) {
            query.isDeleted = false;
        }

        const subcategories =
            await Subcategory.find(query).populate("category");

        setCache(cacheKey, subcategories, 3600); // 1h

        res.status(200).json({
            message: "Subcategories fetched successfully",
            data: subcategories,
        });
    };
};

exports.getSubcategoryBySlug = ({ adminOnly = false } = {}) => {
    return async (req, res) => {
        const slug = req.params.slug;
        const subcategory = await Subcategory.findOne({
            slug,
            ...(!adminOnly && { isDeleted: false }),
        }).populate("category");
        if (!subcategory) {
            return res.status(404).json({
                message: "Subcategory not found",
            });
        }
        res.status(200).json({
            message: "Subcategory fetched successfully",
            data: subcategory,
        });
    };
};

const createSubcategorySchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    slug: Joi.string().min(1).max(50).trim().required(),
    categoryId: Joi.string().required(),
});

exports.createSubcategory = async (req, res) => {
    const { error, value } = createSubcategorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { name, slug, categoryId } = value;

    const slugExists = await Subcategory.findOne({ slug });
    if (slugExists) {
        return res
            .status(409)
            .json({ message: "Subcategory with this slug already exists" });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        return res.status(404).json({ message: "Parent category not found" });
    }

    const image = req.file.filename;
    const subcategory = await Subcategory.create({
        name,
        slug,
        category: categoryId,
        image,
    });

    const populatedSubcategory = await Subcategory.findById(
        subcategory._id,
    ).populate("category");

    clearPrefix(CACHE_PREFIX);

    res.status(201).json({
        message: "Subcategory created successfully",
        data: populatedSubcategory,
    });
};

const updateSubcategorySchema = Joi.object({
    name: Joi.string().min(1).max(50).optional(),
    slug: Joi.string().min(1).max(50).trim().optional(),
    categoryId: Joi.string().optional(),
});

exports.updateSubcategory = async (req, res) => {
    const { error, value } = updateSubcategorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    if (Object.keys(value).length === 0 && !req.file) {
        return res.status(400).json({ message: "No data provided to update" });
    }

    const { name, slug, categoryId } = value;
    const subcategoryId = req.params.id;

    if (slug) {
        const slugExists = await Subcategory.findOne({
            slug,
            _id: { $ne: subcategoryId },
        });
        if (slugExists) {
            return res.status(409).json({
                message: "Subcategory with this slug already exists",
            });
        }
    }

    if (categoryId) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res
                .status(404)
                .json({ message: "Parent category not found" });
        }
    }

    const updateData = {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(categoryId && { category: categoryId }),
    };
    if (req.file) {
        updateData.image = req.file.path;
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
        subcategoryId,
        updateData,
        { new: true, runValidators: true },
    ).populate("category");

    if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
    }

    clearPrefix(CACHE_PREFIX);

    res.status(200).json({
        message: "Subcategory updated successfully",
        data: subcategory,
    });
};

exports.deleteSubcategory = async (req, res) => {
    const subcategoryId = req.params.id;
    const subcategory = await Subcategory.findByIdAndUpdate(
        subcategoryId,
        { isDeleted: true },
        { new: true, runValidators: true },
    ).populate("category");

    if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
    }

    clearPrefix(CACHE_PREFIX);

    res.status(200).json({
        message: "Subcategory deleted successfully",
        data: subcategory,
    });
};
