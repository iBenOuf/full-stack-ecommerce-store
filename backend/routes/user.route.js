const router = require("express").Router();
const {
    deleteUser,
    getUserById,
    getAllUsers,
    updateUserInfo,
    changeUserStatus,
    updatePassword,
} = require("../controllers/user.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get("/all", authenticate, authorize("admin"), asyncHandler(getAllUsers));

router.get(
    "/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(getUserById),
);

router.put(
    "/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(updateUserInfo),
);

router.patch(
    "/:id/password",
    authenticate,
    validateObjectId(),
    asyncHandler(updatePassword),
);

router.put(
    "/:id/status",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(changeUserStatus),
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    validateObjectId(),
    asyncHandler(deleteUser),
);

module.exports = router;
