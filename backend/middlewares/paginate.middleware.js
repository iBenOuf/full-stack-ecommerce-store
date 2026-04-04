const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");
const { getCache, setCache } = require("../utils/cache.utils");

const PRODUCT_LIST_CACHE_PREFIX = "products_list_";

module.exports =
    (Model, { adminOnly = false } = {}) =>
    async (req, res, next) => {
        const {
            filter,
            sort,
            subcategorySlug,
            categorySlug,
            inStock,
            status,
            stockStatus,
            page,
            limit,
        } = req.query;
        let sortField;
        switch (sort) {
            case "createdAtASC":
                sortField = { createdAt: 1 };
                break;
            case "createdAtDESC":
                sortField = { createdAt: -1 };
                break;
            case "priceASC":
                sortField = { price: 1 };
                break;
            case "priceDESC":
                sortField = { price: -1 };
                break;
            case "nameASC":
                sortField = { name: 1 };
                break;
            case "nameDESC":
                sortField = { name: -1 };
                break;
            case "stockASC":
                sortField = { stockQuantity: 1 };
                break;
            case "stockDESC":
                sortField = { stockQuantity: -1 };
                break;
            default:
                sortField = { createdAt: -1 };
                break;
        }
        let categoryId = null;
        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (category) {
                const subcategories = await Subcategory.find({
                    category: category._id,
                });
                const subcategoryIds = subcategories.map((s) => s._id);
                categoryId = subcategoryIds;
            }
        }
        let subcategoryId = null;
        if (subcategorySlug) {
            const subcategory = await Subcategory.findOne({
                slug: subcategorySlug,
            });
            if (subcategory) subcategoryId = subcategory._id;
        }
        const filterConditions = {
            ...(categoryId && { subcategory: { $in: categoryId } }),
            ...(subcategoryId && !categoryId && { subcategory: subcategoryId }),
            ...(filter && {
                $or: [
                    { name: { $regex: filter, $options: "i" } },
                    { description: { $regex: filter, $options: "i" } },
                ],
            }),
            ...(!adminOnly && { isActive: true, isDeleted: false }),
            ...(adminOnly && status === "active" && { isDeleted: false }),
            ...(adminOnly && status === "deleted" && { isDeleted: true }),
            ...(adminOnly && status === "enabled" && { isActive: true }),
            ...(adminOnly && status === "disabled" && { isActive: false }),
            ...(inStock === "true" && { stockQuantity: { $gt: 0 } }),
            ...(stockStatus === "low" && { stockQuantity: { $gt: 0, $lte: 5 } }),
            ...(stockStatus === "out" && { stockQuantity: 0 }),
        };

        let mongooseQuery = Model.find(filterConditions)
            .sort(sortField)
            .populate("subcategory");

        const cacheKey = !adminOnly
            ? `${PRODUCT_LIST_CACHE_PREFIX}${JSON.stringify(req.query)}`
            : null;

        if (cacheKey) {
            const cached = getCache(cacheKey);
            if (cached) {
                res.paginatedData = cached;
                return next();
            }
        }

        try {
            const total = await Model.countDocuments(filterConditions);
            let pagination = { total };
            if (page || limit) {
                const pageValue = parseInt(page) || 1;
                const limitValue = parseInt(limit) || 10;
                const totalPages = Math.ceil(total / limitValue);
                const skip = (pageValue - 1) * limitValue;
                mongooseQuery = mongooseQuery.skip(skip).limit(limitValue);
                pagination = {
                    page: pageValue,
                    limit: limitValue,
                    totalPages,
                    total,
                };
            }
            const data = await mongooseQuery;
            const result = { ...pagination, data };
            res.paginatedData = result;

            if (cacheKey) {
                setCache(cacheKey, result, 300);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
