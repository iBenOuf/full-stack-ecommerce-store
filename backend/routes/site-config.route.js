const router = require("express").Router();
const {
    getSiteConfig,
    updateSiteConfig,
    uploadHeroImage,
} = require("../controllers/site-config.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");

router.get("/", asyncHandler(getSiteConfig));

router.put(
    "/",
    authenticate,
    authorize("admin"),
    asyncHandler(updateSiteConfig),
);

router.post(
    "/upload-hero",
    authenticate,
    authorize("admin"),
    upload("assets/images").single("heroImage"),
    asyncHandler(uploadHeroImage),
);

module.exports = router;
