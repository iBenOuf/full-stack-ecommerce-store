module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === "CastError") {
        return res
            .status(400)
            .json({ message: `Invalid value for '${err.path}': ${err.value}` });
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(", ") });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res
            .status(409)
            .json({
                message: `Duplicate value for '${field}'. Please use a unique value.`,
            });
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
