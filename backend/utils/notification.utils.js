const Notification = require("../models/notification.model");
const { getIo } = require("./socket.utils");

exports.createNotification = async (type, title, message, ref, refModel) => {
    try {
        const notification = await Notification.create({
            type,
            title,
            message,
            ref,
            refModel,
        });

        const io = getIo();
        if (io) {
            io.to("admins").emit(type, notification);
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};
