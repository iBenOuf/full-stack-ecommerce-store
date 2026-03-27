const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const Joi = require("joi");
const { createNotification } = require("../utils/notification.utils");

const createOrderSchema = Joi.object({
    shippingAddress: Joi.object({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        governorate: Joi.string().trim().required(),
    }).required(),
    deliveryPhone: Joi.string()
        .pattern(/^[0-9+\-\s]{10,15}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Delivery phone must be a valid phone number (10-15 digits)",
        }),
});

exports.createOrder = async (req, res) => {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.user._id;
    const { shippingAddress, deliveryPhone } = value;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    try {
        for (const item of cart.items) {
            const product = await Product.findOneAndUpdate(
                { _id: item.product, stockQuantity: { $gte: item.quantity } },
                { $inc: { stockQuantity: -item.quantity } },
                { new: true },
            );
            if (!product) {
                return res
                    .status(400)
                    .json({
                        message: `Product ${item.product} not found or out of stock`,
                    });
            }
        }

        const [order] = await Order.create([
            {
                user: userId,
                items: cart.items,
                shippingAddress,
                deliveryPhone,
            },
        ]);

        await Cart.deleteOne({ _id: cart._id });

        const populatedOrder = await Order.findById(order._id).populate(
            "items.product",
        );

        await createNotification(
            "new_order",
            `New order #${order._id.toString().slice(-6)} placed.`,
            order._id,
            "Order",
        );

        for (const item of cart.items) {
            const prod = await Product.findById(item.product);
            if (prod && prod.stockQuantity <= 5) {
                await createNotification(
                    "low_stock",
                    `Product ${prod.name} has low stock (${prod.stockQuantity} left).`,
                    prod._id,
                    "Product",
                );
            }
        }

        res.status(201).json({
            message: "Order created successfully",
            data: populatedOrder,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);
        res.status(500).json({
            message: error.message || "Failed to place order",
        });
    }
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .populate("items.product")
        .populate("user", "firstName lastName email phone")
        .sort({ createdAt: -1 });
    res.status(200).json({
        message: "Orders retrieved successfully",
        data: orders,
    });
};

exports.getOrdersByUserId = async (req, res) => {
    const userId = req.params.id;
    const reqUserId = req.user._id.toString();
    const role = req.user.role;

    if (role === "customer" && userId !== reqUserId) {
        return res
            .status(403)
            .json({ message: "You can only view your own orders" });
    }

    const orders = await Order.find({ user: userId })
        .populate("items.product")
        .sort({ createdAt: -1 });
    res.status(200).json({
        message: "Orders retrieved successfully",
        data: orders,
    });
};

exports.getOrderById = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
        .populate("items.product")
        .populate("user", "firstName lastName email phone");
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const role = req.user.role;
    if (
        role === "customer" &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        return res
            .status(403)
            .json({ message: "You can only view your own orders" });
    }

    res.status(200).json({
        message: "Order retrieved successfully",
        data: order,
    });
};

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "pending",
            "preparing",
            "canceled_by_client",
            "canceled_by_admin",
            "shipped",
            "delivered",
            "rejected",
            "returned",
        )
        .required(),
});

exports.updateOrderStatus = async (req, res) => {
    const { error, value } = updateOrderStatusSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const orderId = req.params.id;
    const { status } = value;
    const role = req.user.role;

    if (role === "customer" && status !== "canceled_by_client") {
        return res.status(403).json({
            message: "Customers can only cancel orders",
        });
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (role === "customer") {
        if (order.user.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "You can only cancel your own orders" });
        }
        if (order.status !== "pending") {
            return res.status(400).json({
                message:
                    "Orders can only be canceled while they are still pending",
            });
        }
    }

    const restorableStatuses = [
        "returned",
        "rejected",
        "canceled_by_client",
        "canceled_by_admin",
    ];

    const previousStatus = order.status;
    const needsStockRestore =
        restorableStatuses.includes(status) &&
        !restorableStatuses.includes(previousStatus);

    if (needsStockRestore) {
        try {
            for (const item of order.items) {
                const product = await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stockQuantity: item.quantity } },
                    { new: true },
                );
                if (!product) {
                    return res
                        .status(404)
                        .json({
                            message: `Product ${item.product} not found during stock restoration`,
                        });
                }
            }
            order.status = status;
            await order.save();

            return res.status(200).json({
                message: "Order updated successfully",
                data: order,
            });
        } catch (err) {
            console.error("UPDATE ORDER STATUS ERROR:", err);
            return res.status(500).json({
                message: err.message || "Failed to update order",
            });
        }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        message: "Order updated successfully",
        data: order,
    });
};

exports.reorder = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId.toString()) {
        return res
            .status(403)
            .json({ message: "You can only re-order your own orders" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const skippedItems = [];
    const addedItems = [];

    for (const item of order.items) {
        const product = await Product.findOne({
            _id: item.product._id,
            isActive: true,
            isDeleted: false,
        });

        if (!product || product.stockQuantity === 0) {
            skippedItems.push(item.product.name);
            continue;
        }

        const addQuantity = Math.min(item.quantity, product.stockQuantity);

        const existingCartItem = cart.items.find(
            (ci) => ci.product.toString() === product._id.toString(),
        );
        if (existingCartItem) {
            existingCartItem.quantity += addQuantity;
            existingCartItem.unitPrice = product.price;
        } else {
            cart.items.push({
                product: product._id,
                quantity: addQuantity,
                unitPrice: product.price,
            });
        }
        addedItems.push(product.name);
    }

    await cart.save();

    res.status(200).json({
        message: "Re-order processed. Items added to cart.",
        data: {
            cart,
            skippedItems,
            addedItems,
        },
    });
};
