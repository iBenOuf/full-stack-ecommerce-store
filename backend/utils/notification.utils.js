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

        console.log(`[NOTIFICATION] Created: type=${type}, title=${title}`);

        const io = getIo();
        if (io) {
            const connectedCount = io.sockets.sockets.size;
            console.log(`[NOTIFICATION] Emitting "${type}" to admins room, ${connectedCount} sockets connected`);
            io.to("admins").emit(type, notification);
        } else {
            console.error("[NOTIFICATION] Socket.io not initialized, cannot emit event");
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};
