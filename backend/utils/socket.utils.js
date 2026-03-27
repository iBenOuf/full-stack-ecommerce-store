const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

let io;

exports.initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS
                ? process.env.ALLOWED_ORIGINS.split(",")
                : "*",
            methods: ["GET", "POST"],
        },
    });

    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth.token || socket.handshake.headers.token;
            if (!token) {
                return next(
                    new Error("Authentication error: No token provided"),
                );
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id).select(
                "role isActive isDeleted",
            );

            if (!user || user.isDeleted || !user.isActive) {
                return next(new Error("Authentication error: User invalid"));
            }

            if (user.role === "admin" || user.role === "moderator") {
                socket.user = user;
                return next();
            } else {
                return next(new Error("Authentication error: Not authorized"));
            }
        } catch (error) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Admin/Moderator connected to socket: ${socket.id}`);
        socket.join("admins");

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

exports.getIo = () => {
    if (!io) {
        console.warn("Socket.io not initialized!");
    }
    return io;
};
