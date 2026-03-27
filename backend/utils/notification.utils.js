const Notification = require("../models/notification.model");
const { getIo } = require("./socket.utils");

exports.createNotification = async (type, message, ref, refModel) => {
    try {
        const notification = await Notification.create({
            type,
            message,
            ref,
            refModel,
        });

        const io = getIo();
        if (io) {
            io.to("admins").emit("new_notification", notification);
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};
