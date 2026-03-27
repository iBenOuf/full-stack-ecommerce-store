const router = require("express").Router();
const {
    createProduct,
    getProductBySlug,
    getProductById,
    getRelatedProducts,
    deleteProductById,
    updateProductById,
    getPaginatedProducts,
    getBestSellerProducts,
} = require("../controllers/product.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");
const paginate = require("../middlewares/paginate.middleware");
const Product = require("../models/product.model");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.post(
    "/",
    authenticate,
    authorize("admin"),
    upload("products").single("image"),
    asyncHandler(createProduct),
);
router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    upload("products").single("image"),
    asyncHandler(updateProductById),
);
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteProductById),
);

router.get("/related", asyncHandler(getRelatedProducts));

router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    paginate(Product, { adminOnly: true }),
    getPaginatedProducts,
);

router.get("/best-sellers", asyncHandler(getBestSellerProducts));

router.get("/list", paginate(Product), getPaginatedProducts);

router.get(
    "/admin/:slug",
    authenticate,
    authorize("admin"),
    asyncHandler(getProductBySlug({ adminOnly: true })),
);
router.get("/slug/:slug", asyncHandler(getProductBySlug()));
router.get("/id/:id", validateObjectId(), asyncHandler(getProductById));

module.exports = router;
