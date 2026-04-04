const Testimonial = require("../models/testimonial.model");
const Joi = require("joi");
const { createNotification } = require("../utils/notification.utils");

const createTestimonialSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(1).max(500).trim().required(),
});

exports.createTestimonial = async (req, res) => {
    const { error, value } = createTestimonialSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { rating, comment } = value;
    const userId = req.user._id;

    const testimonial = await Testimonial.create({
        user: userId,
        rating,
        comment,
    });

    await createNotification(
        "new_testimonial",
        "New Testimonial",
        `New ${rating}-star testimonial submitted.`,
        testimonial._id,
        "Testimonial"
    );

    res.status(201).json({
        message: "Testimonial submitted successfully",
        data: testimonial,
    });
};

exports.getApprovedTestimonials = async (req, res) => {
    const testimonials = await Testimonial.find({
        status: "approved",
        isDeleted: false,
    })
        .populate("user", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Testimonials fetched successfully",
        data: testimonials,
    });
};

exports.getAllTestimonials = async (req, res) => {
    const { status } = req.query;
    const filter = { isDeleted: false };
    if (status) {
        filter.status = status;
    }
    const testimonials = await Testimonial.find(filter)
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Testimonials fetched successfully",
        data: testimonials,
    });
};

const updateTestimonialStatusSchema = Joi.object({
    status: Joi.string().valid("approved", "rejected").required(),
});

exports.updateTestimonialStatus = async (req, res) => {
    const { error, value } = updateTestimonialStatusSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const testimonialId = req.params.id;
    const { status } = value;

    const testimonial = await Testimonial.findByIdAndUpdate(
        testimonialId,
        { status },
        { new: true, runValidators: true },
    ).populate("user", "firstName lastName email");

    if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({
        message: "Testimonial status updated successfully",
        data: testimonial,
    });
};

exports.deleteTestimonial = async (req, res) => {
    const testimonialId = req.params.id;
    const testimonial = await Testimonial.findByIdAndUpdate(
        testimonialId,
        { isDeleted: true },
        { new: true, runValidators: true },
    );

    if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({
        message: "Testimonial deleted successfully",
        data: testimonial,
    });
};
