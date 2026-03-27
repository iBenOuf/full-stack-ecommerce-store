const Page = require("../models/page.model");
const Joi = require("joi");

exports.getPageBySlug = async (req, res) => {
    const { slug } = req.params;
    const page = await Page.findOne({ pageSlug: slug, isDeleted: false });
    if (!page) {
        return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json({
        message: "Page fetched successfully",
        data: page,
    });
};

exports.getAllPages = async (req, res) => {
    const pages = await Page.find({ isDeleted: false }).sort({
        createdAt: -1,
    });
    res.status(200).json({
        message: "Pages fetched successfully",
        data: pages,
    });
};

const createPageSchema = Joi.object({
    pageSlug: Joi.string().min(1).max(100).trim().required(),
    title: Joi.string().min(1).max(200).trim().required(),
    content: Joi.string().min(1).required(),
    isActive: Joi.boolean().optional(),
});

exports.createPage = async (req, res) => {
    const { error, value } = createPageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { pageSlug, title, content } = value;

    const slugExists = await Page.findOne({ pageSlug });
    if (slugExists) {
        return res
            .status(409)
            .json({ message: "Page with this slug already exists" });
    }

    const page = await Page.create({ pageSlug, title, content });
    res.status(201).json({
        message: "Page created successfully",
        data: page,
    });
};

const updatePageSchema = Joi.object({
    title: Joi.string().min(1).max(200).trim().optional(),
    content: Joi.string().min(1).optional(),
    isActive: Joi.boolean().optional(),
});

exports.updatePage = async (req, res) => {
    const { error, value } = updatePageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    if (Object.keys(value).length === 0) {
        return res.status(400).json({ message: "No data provided to update" });
    }

    const pageId = req.params.id;
    const page = await Page.findByIdAndUpdate(pageId, value, {
        new: true,
        runValidators: true,
    });
    if (!page) {
        return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json({
        message: "Page updated successfully",
        data: page,
    });
};

exports.deletePage = async (req, res) => {
    const pageId = req.params.id;
    const page = await Page.findByIdAndUpdate(
        pageId,
        { isDeleted: true },
        { new: true, runValidators: true },
    );
    if (!page) {
        return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json({
        message: "Page deleted successfully",
        data: page,
    });
};
