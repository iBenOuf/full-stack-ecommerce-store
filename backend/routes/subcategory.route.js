const router = require("express").Router();
const {
    createSubcategory,
    deleteSubcategory,
    getAllSubcategories,
    getAllSubcategoriesByCategorySlug,
    getSubcategoryBySlug,
    updateSubcategory,
} = require("../controllers/subcategory.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");
const asyncHandler = require("../utils/catch-async.utils");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.post(
    "/",
    authenticate,
    authorize("admin"),
    upload("subcategories").single("image"),
    asyncHandler(createSubcategory),
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    upload("subcategories").single("image"),
    asyncHandler(updateSubcategory),
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteSubcategory),
);

router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    asyncHandler(getAllSubcategories({ adminOnly: true })),
);

router.get("/", asyncHandler(getAllSubcategories()));

router.get(
    "/admin/category",
    authenticate,
    authorize("admin"),
    asyncHandler(getAllSubcategoriesByCategorySlug({ adminOnly: true })),
);

router.get(
    "/category",
    asyncHandler(getAllSubcategoriesByCategorySlug()),
);

router.get(
    "/admin/:slug",
    authenticate,
    authorize("admin"),
    asyncHandler(getSubcategoryBySlug({ adminOnly: true })),
);

router.get("/:slug", asyncHandler(getSubcategoryBySlug()));

module.exports = router;
