const router = require("express").Router();
const {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
} = require("../controllers/order.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.post("/", authenticate, asyncHandler(createOrder));
router.get(
    "/user/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(getOrdersByUserId),
);
router.get(
    "/details/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(getOrderById),
);
router.get(
    "/",
    authenticate,
    authorize("admin", "moderator"),
    asyncHandler(getAllOrders),
);
router.patch(
    "/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(updateOrderStatus),
);

router.post(
    "/reorder/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(require("../controllers/order.controller").reorder)
);

module.exports = router;
