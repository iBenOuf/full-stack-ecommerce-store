const router = require("express").Router();
const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart,
    mergeCart,
} = require("../controllers/cart.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get("/", authenticate, asyncHandler(getCart));
router.post("/", authenticate, asyncHandler(addToCart));
router.put("/", authenticate, asyncHandler(updateCart));
router.delete(
    "/item/:productId",
    authenticate,
    validateObjectId("productId"),
    asyncHandler(removeFromCart),
);
router.delete("/", authenticate, asyncHandler(clearCart));
router.post("/merge", authenticate, asyncHandler(mergeCart));

module.exports = router;
