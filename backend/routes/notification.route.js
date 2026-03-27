const router = require("express").Router();
const {
    getAllNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require("../controllers/notification.controller");
const asyncHandler = require("../utils/catch-async.utils");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
    validateObjectId,
} = require("../middlewares/validate-objectid.middleware");

router.use(authenticate, authorize("admin", "moderator"));

router.get("/", asyncHandler(getAllNotifications));
router.get("/unread-count", asyncHandler(getUnreadCount));
router.patch("/read-all", asyncHandler(markAllAsRead));
router.patch("/:id/read", validateObjectId(), asyncHandler(markAsRead));
router.delete("/:id", validateObjectId(), asyncHandler(deleteNotification));

module.exports = router;
