const router = require("express").Router();
const {
    getMyAddresses,
    getAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/address.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.get(
    "/by-id/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(getAddressById),
);

router.get("/my-addresses", authenticate, asyncHandler(getMyAddresses));

router.post("/add", authenticate, asyncHandler(addAddress));

router.put(
    "/update/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(updateAddress),
);

router.delete(
    "/delete/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(deleteAddress),
);

router.patch(
    "/default/:id",
    authenticate,
    validateObjectId(),
    asyncHandler(setDefaultAddress),
);

module.exports = router;
