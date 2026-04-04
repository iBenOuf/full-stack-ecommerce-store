const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

dotenv.config();

const corsMiddleware = require("./middlewares/cors.middleware");

const connectDB = require("./config/db.config");
connectDB();

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);
app.use(corsMiddleware);
app.use(express.json({ limit: "10kb" }));

// Swagger API Documentation
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/api/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Aura API Documentation",
}));

app.use("/api/v1/auth", require("./routes/auth.route"));
app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/product", require("./routes/product.route"));
app.use("/api/v1/category", require("./routes/category.route"));
app.use("/api/v1/subcategory", require("./routes/subcategory.route"));
app.use("/api/v1/address", require("./routes/address.route"));
app.use("/api/v1/order", require("./routes/order.route"));
app.use("/api/v1/cart", require("./routes/cart.route"));
app.use("/api/v1/testimonial", require("./routes/testimonial.route"));
app.use("/api/v1/page", require("./routes/page.route"));
app.use("/api/v1/site-config", require("./routes/site-config.route"));
app.use("/api/v1/notification", require("./routes/notification.route"));
app.use("/api/v1/faq", require("./routes/faq.route"));
app.use("/api/v1/report", require("./routes/report.route"));

app.get("/api/v1/", (req, res) => {
    res.status(200).json({
        message: "API is running",
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

const AppError = require("./utils/err.utils");
const globalErrorHandler = require("./middlewares/error-handler.middleware");

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const http = require("http");
const server = http.createServer(app);
const { initSocket } = require("./utils/socket.utils");
initSocket(server);

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
