const router = require("express").Router();
const {
    getSiteConfig,
    updateSiteConfig,
} = require("../controllers/site-config.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", asyncHandler(getSiteConfig));

router.put(
    "/",
    authenticate,
    authorize("admin"),
    asyncHandler(updateSiteConfig),
);

module.exports = router;
