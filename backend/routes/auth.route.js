const router = require("express").Router();
const {
    registerUser,
    login,
    getMe,
} = require("../controllers/auth.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.post("/register", asyncHandler(registerUser("customer")));

router.post(
    "/register/moderator",
    authenticate,
    authorize("admin"),
    asyncHandler(registerUser("moderator")),
);

router.post(
    "/register/admin",
    authenticate,
    authorize("admin"),
    asyncHandler(registerUser("admin")),
);

router.post("/login", asyncHandler(login));

router.get("/me", authenticate, getMe);

module.exports = router;
