const router = require("express").Router();
const { getSalesReport } = require("../controllers/report.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", authenticate, authorize("admin"), asyncHandler(getSalesReport));

module.exports = router;
