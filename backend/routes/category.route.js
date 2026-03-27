const router = require("express").Router();
const {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");
const asyncHandler = require("../utils/catch-async.utils");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.post(
    "/add",
    authenticate,
    authorize("admin"),
    upload("categories").single("image"),
    asyncHandler(createCategory),
);
router.put(
    "/update/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    upload("categories").single("image"),
    asyncHandler(updateCategory),
);
router.delete(
    "/delete/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteCategory),
);

router.get(
    "/by-id/admin/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(getCategoryById({ adminOnly: true })),
);
router.get("/by-id/:id", validateObjectId(), asyncHandler(getCategoryById()));

router.get(
    "/by-slug/admin/:slug",
    authenticate,
    authorize("admin"),
    asyncHandler(getCategoryBySlug({ adminOnly: true })),
);
router.get("/by-slug/:slug", asyncHandler(getCategoryBySlug()));
router.get(
    "/all/admin",
    authenticate,
    authorize("admin"),
    asyncHandler(getAllCategories({ adminOnly: true })),
);
router.get("/all", asyncHandler(getAllCategories()));

module.exports = router;
