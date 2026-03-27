const Notification = require("../models/notification.model");

exports.getAllNotifications = async (req, res) => {
    const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50);
    res.status(200).json({
        message: "Notifications fetched successfully",
        data: notifications,
    });
};

exports.getUnreadCount = async (req, res) => {
    const count = await Notification.countDocuments({ isRead: false });
    res.status(200).json({
        message: "Unread count fetched successfully",
        data: { count },
    });
};

exports.markAsRead = async (req, res) => {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true, runValidators: true },
    );
    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({
        message: "Notification marked as read",
        data: notification,
    });
};

exports.markAllAsRead = async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({
        message: "All notifications marked as read",
    });
};

exports.deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    const notification =
        await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({
        message: "Notification deleted successfully",
        data: notification,
    });
};
