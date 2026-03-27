const FAQ = require("../models/faq.model");
const Joi = require("joi");

exports.getAllFAQs = async (req, res) => {
    const isAdminRequest = req.originalUrl.includes("/admin");
    const query = { isDeleted: false };

    if (!isAdminRequest) {
        query.isActive = true;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
        message: "FAQs fetched successfully",
        data: faqs,
    });
};

const createFAQSchema = Joi.object({
    question: Joi.string().min(1).max(500).trim().required(),
    answer: Joi.string().min(1).max(2000).trim().required(),
    order: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
});

exports.createFAQ = async (req, res) => {
    const { error, value } = createFAQSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const faq = await FAQ.create(value);

    res.status(201).json({
        message: "FAQ created successfully",
        data: faq,
    });
};

const updateFAQSchema = Joi.object({
    question: Joi.string().min(1).max(500).trim().optional(),
    answer: Joi.string().min(1).max(2000).trim().optional(),
    order: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
});

exports.updateFAQ = async (req, res) => {
    const { error, value } = updateFAQSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (Object.keys(value).length === 0) {
        return res.status(400).json({ message: "No data provided to update" });
    }

    const faqId = req.params.id;
    const faq = await FAQ.findByIdAndUpdate(faqId, value, {
        new: true,
        runValidators: true,
    });

    if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({
        message: "FAQ updated successfully",
        data: faq,
    });
};

exports.deleteFAQ = async (req, res) => {
    const faqId = req.params.id;
    const faq = await FAQ.findByIdAndUpdate(
        faqId,
        { isDeleted: true },
        { new: true, runValidators: true },
    );

    if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({
        message: "FAQ deleted successfully",
        data: faq,
    });
};
