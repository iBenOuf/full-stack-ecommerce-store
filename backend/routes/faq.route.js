const router = require("express").Router();
const {
    getAllFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
} = require("../controllers/faq.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get("/", asyncHandler(getAllFAQs));
router.get("/admin", authenticate, authorize("admin"), asyncHandler(getAllFAQs));

router.post("/", authenticate, authorize("admin"), asyncHandler(createFAQ));

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(updateFAQ),
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteFAQ),
);

module.exports = router;
