const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.getSalesReport = async (req, res) => {
    const { startDate, endDate } = req.query;

    const matchStage = {
        status: { $in: ["delivered", "shipped", "preparing"] },
    };

    if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchStage.createdAt.$lte = end;
        }
    }

    try {
        const report = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.unitPrice"],
                        },
                    },
                    totalOrders: { $addToSet: "$_id" },
                    totalItemsSold: { $sum: "$items.quantity" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalOrders: { $size: "$totalOrders" },
                    totalItemsSold: 1,
                },
            },
        ]);

        const topProducts = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.unitPrice"],
                        },
                    },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 1,
                    name: "$product.name",
                    totalSold: 1,
                    revenue: 1,
                },
            },
        ]);

        const salesTrends = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    dailySales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const recentOrders = await Order.find(matchStage)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "firstName lastName email")
            .select("user status totalAmount createdAt");

        const lowStockProducts = await Product.find({
            isDeleted: false,
            stockQuantity: { $lt: 10 },
        })
            .limit(10)
            .select("name stockQuantity price");

        const categoryDistribution = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: { $ifNull: ["$category.name", "Uncategorized"] },
                    revenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.unitPrice"],
                        },
                    },
                    orderIds: { $addToSet: "$_id" },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    revenue: 1,
                    count: { $size: "$orderIds" },
                },
            },
            { $sort: { revenue: -1 } },
        ]);

        const totalCustomers = await Order.distinct("user", matchStage);
        const totalProducts = await Product.countDocuments({
            isDeleted: false,
        });

        const summary =
            report.length > 0
                ? {
                      totalSales: report[0].totalRevenue,
                      totalOrders: report[0].totalOrders,
                      totalItemsSold: report[0].totalItemsSold,
                      totalCustomers: totalCustomers.length,
                      totalProducts,
                  }
                : {
                      totalSales: 0,
                      totalOrders: 0,
                      totalItemsSold: 0,
                      totalCustomers: 0,
                      totalProducts,
                  };

        res.status(200).json({
            message: "Sales report generated successfully",
            data: {
                summary,
                topProducts,
                salesTrends,
                recentOrders,
                lowStockProducts,
                categoryDistribution,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate sales report",
            error: error.message,
        });
    }
};
