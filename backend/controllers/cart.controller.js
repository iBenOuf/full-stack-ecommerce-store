const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Joi = require("joi");

const addToCartSchema = Joi.object({
    productId: Joi.string().optional(),
    product: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).required(),
}).or("productId", "product");

exports.addToCart = async (req, res) => {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
        console.log("[ADD TO CART] Validation error:", error.details[0].message, "Body:", JSON.stringify(req.body));
        return res.status(400).json({ message: error.details[0].message });
    }

    const productId = value.productId || value.product;
    const { quantity } = value;
    const userId = req.user._id;

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
        isDeleted: false,
    });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (quantity > product.stockQuantity) {
        return res.status(400).json({
            message: "Product is out of stock or quantity exceeds stock",
        });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity, unitPrice: product.price }],
        });
        return res.status(201).json({
            message: "Product added to cart successfully",
            data: cart,
        });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
    );

    if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stockQuantity) {
            return res.status(400).json({
                message: "Total quantity exceeds available stock",
            });
        }
        existingItem.quantity = newQty;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            unitPrice: product.price,
        });
    }

    await cart.save();
    res.status(200).json({
        message: "Product added to cart successfully",
        data: cart,
    });
};

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
    );
    if (!cart) {
        return res
            .status(200)
            .json({ message: "Cart is empty", data: { items: [] } });
    }

    const removedItems = [];
    cart.items = cart.items.filter((item) => {
        if (!item.product || item.product.isDeleted || !item.product.isActive) {
            removedItems.push(item.product?.name || "Unknown product");
            return false;
        }
        return true;
    });

    if (removedItems.length > 0) {
        await cart.save();
    }

    const response = { message: "Cart fetched successfully", data: cart };
    if (removedItems.length > 0) {
        response.removedItems = removedItems;
    }
    res.status(200).json(response);
};

const updateCartSchema = Joi.object({
    productId: Joi.string().optional(),
    product: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).required(),
}).or("productId", "product");

exports.updateCart = async (req, res) => {
    const { error, value } = updateCartSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const productId = value.productId || value.product;
    const { quantity } = value;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
    );

    if (!existingItem) {
        return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (product.isDeleted || !product.isActive) {
        return res.status(400).json({
            message: "Product is no longer available",
        });
    }
    if (quantity > product.stockQuantity) {
        return res.status(400).json({
            message: "Product is out of stock or quantity exceeds stock",
        });
    }

    existingItem.quantity = quantity;
    await cart.save();
    res.status(200).json({
        message: "Cart updated successfully",
        data: cart,
    });
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const itemExists = cart.items.some(
        (item) => item.product.toString() === productId,
    );
    if (!itemExists) {
        return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
    );

    await cart.save();
    res.status(200).json({
        message: "Product removed from cart successfully",
        data: cart,
    });
};

exports.clearCart = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    res.status(200).json({ message: "Cart cleared successfully" });
};

const mergeCartSchema = Joi.object({
    _id: Joi.any().optional(),
    user: Joi.any().optional(),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().optional(),
                product: Joi.any().optional(),
                quantity: Joi.number().integer().min(1).required(),
                unitPrice: Joi.number().optional(),
            }).or("productId", "product"),
        )
        .min(1)
        .required(),
});

exports.mergeCart = async (req, res) => {
    const { error, value } = mergeCartSchema.validate(req.body);
    if (error) {
        console.log("[MERGE CART] Validation error:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const { items } = value;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        for (const item of items) {
            let productId = item.productId || item.product;
            if (typeof productId === "object" && productId !== null) {
                if (productId._id) {
                    productId = productId._id.toString();
                } else {
                    continue;
                }
            }

            if (!productId) continue;

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
            isDeleted: false,
        });
        if (!product || product.stockQuantity === 0) continue;

        const existingItem = cart.items.find(
            (i) => i.product && i.product.toString() === productId,
        );

        if (existingItem) {
            // Use the higher quantity from either local or server (not add them together)
            existingItem.quantity = Math.max(existingItem.quantity, item.quantity);
            existingItem.quantity = Math.min(existingItem.quantity, product.stockQuantity);
            existingItem.unitPrice = product.price;
        } else {
            const cappedQty = Math.min(item.quantity, product.stockQuantity);
            cart.items.push({
                product: productId,
                quantity: cappedQty,
                unitPrice: product.price,
            });
        }
    }

    await cart.save();
    res.status(200).json({
        message: "Cart merged successfully",
        data: cart,
    });
    } catch (err) {
        console.error("[MERGE CART] Error:", err);
        res.status(500).json({
            message: err.message || "Failed to merge cart",
        });
    }
};
