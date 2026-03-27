const router = require("express").Router();
const {
    createTestimonial,
    getApprovedTestimonials,
    getAllTestimonials,
    updateTestimonialStatus,
    deleteTestimonial,
} = require("../controllers/testimonial.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get("/", asyncHandler(getApprovedTestimonials));

router.post("/", authenticate, asyncHandler(createTestimonial));

router.get(
    "/admin",
    authenticate,
    authorize("admin", "moderator"),
    asyncHandler(getAllTestimonials),
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("admin", "moderator"),
    validateObjectId(),
    asyncHandler(updateTestimonialStatus),
);

router.put(
    "/:id",
    authenticate,
    authorize("admin", "moderator"),
    validateObjectId(),
    asyncHandler(updateTestimonialStatus),
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteTestimonial),
);

module.exports = router;
