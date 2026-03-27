const router = require("express").Router();
const {
    getPageBySlug,
    getAllPages,
    createPage,
    updatePage,
    deletePage,
} = require("../controllers/page.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get("/:slug", asyncHandler(getPageBySlug));

router.get("/", authenticate, authorize("admin"), asyncHandler(getAllPages));

router.post("/", authenticate, authorize("admin"), asyncHandler(createPage));

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(updatePage),
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deletePage),
);

module.exports = router;
