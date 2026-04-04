const SiteConfig = require("../models/site-config.model");
const Joi = require("joi");
const { getCache, setCache, clearCache } = require("../utils/cache.utils");
const { deleteFromCloudinary, extractPublicIdFromUrl } = require("../utils/cloudinary");

const SITE_CONFIG_CACHE_KEY = "site_config";

exports.getSiteConfig = async (req, res) => {
    const cachedConfig = getCache(SITE_CONFIG_CACHE_KEY);
    if (cachedConfig) {
        return res.status(200).json({
            message: "Site config fetched successfully (cached)",
            data: cachedConfig,
        });
    }

    let config = await SiteConfig.findOne();
    if (!config) {
        config = await SiteConfig.create({});
    }

    setCache(SITE_CONFIG_CACHE_KEY, config, 86400); // Cache for 24h

    res.status(200).json({
        message: "Site config fetched successfully",
        data: config,
    });
};

const updateSiteConfigSchema = Joi.object({
    siteName: Joi.string().max(100).trim().optional().allow(""),
    announcement: Joi.string().max(300).trim().optional().allow(""),
    
    heroSection: Joi.object({
        heroSlogan: Joi.string().optional().allow(""),
        heroTitle: Joi.object({
            line1: Joi.string().optional().allow(""),
            line2: Joi.string().optional().allow(""),
            line3: Joi.string().optional().allow(""),
        }).optional(),
        heroDescription: Joi.string().optional().allow(""),
        heroImage: Joi.string().optional().allow(""),
        season: Joi.string().optional().allow(""),
    }).optional(),

    aboutSection: Joi.object({
        aboutSlogan: Joi.string().optional().allow(""),
        aboutTitle: Joi.object({
            line1: Joi.string().optional().allow(""),
            line2: Joi.string().optional().allow(""),
            line3: Joi.string().optional().allow(""),
        }).optional(),
        aboutDescription: Joi.string().optional().allow(""),
        analytics: Joi.object({
            stat1: Joi.object({ value: Joi.string().optional().allow(""), label: Joi.string().optional().allow("") }).optional(),
            stat2: Joi.object({ value: Joi.string().optional().allow(""), label: Joi.string().optional().allow("") }).optional(),
            stat3: Joi.object({ value: Joi.string().optional().allow(""), label: Joi.string().optional().allow("") }).optional(),
            stat4: Joi.object({ value: Joi.string().optional().allow(""), label: Joi.string().optional().allow("") }).optional(),
        }).optional(),
    }).optional(),

    footerSection: Joi.object({
        footerText: Joi.string().optional().allow(""),
        socialLinks: Joi.array().items(
            Joi.object({
                name: Joi.string().optional().allow(""),
                url: Joi.string().uri().optional().allow(""),
            })
        ).optional(),
        contactEmail: Joi.string().email().optional().allow(""),
        contactPhone: Joi.string().optional().allow(""),
        copyrightText: Joi.string().optional().allow(""),
        paymentMethods: Joi.array().items(
            Joi.object({
                name: Joi.string().optional().allow(""),
            })
        ).optional(),
    }).optional(),

    coreValues: Joi.array().items(
        Joi.object({
            icon: Joi.string().optional().allow(""),
            title: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
            description: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        })
    ).optional(),

    shippingPolicy: Joi.object({
        title: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        freeShipping: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        standardDelivery: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        returnsPolicy: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        returnsDays: Joi.number().integer().min(0).optional(),
    }).optional(),

    footerLinks: Joi.array().items(
        Joi.object({
            section: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
            links: Joi.array().items(
                Joi.object({
                    label: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
                    url: Joi.string().optional().allow(""),
                })
            ).optional(),
        })
    ).optional(),

    shopPage: Joi.object({
        heading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        subtitle: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
    }).optional(),

    contactPage: Joi.object({
        eyebrow: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        heading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        subtitle: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        emailHeading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        emailDesc: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        phoneHeading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        phoneDesc: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        visitHeading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        visitDesc: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        socialEyebrow: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        socialHeading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        faqText: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        faqLinkText: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
    }).optional(),

    faqPage: Joi.object({
        heading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        subtitle: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        footerText: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        footerButtonText: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
    }).optional(),

    notFoundPage: Joi.object({
        eyebrow: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        heading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        subtitle: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        suggestionsHeading: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
        suggestions: Joi.array().items(
            Joi.object({
                label: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
                url: Joi.string().optional().allow(""),
            })
        ).optional(),
    }).optional(),

    navLinks: Joi.array().items(
        Joi.object({
            label: Joi.object({ en: Joi.string().optional().allow("") }).optional(),
            url: Joi.string().optional().allow(""),
            queryParams: Joi.object().optional(),
        })
    ).optional(),
});

exports.updateSiteConfig = async (req, res) => {
    const { error, value } = updateSiteConfigSchema.validate(req.body);
    if (error) {
        console.log("Joi validation error:", error.details[0].message);
        console.log("Received body keys:", Object.keys(req.body));
        return res.status(400).json({ message: error.details[0].message });
    }

    const config = await SiteConfig.findOneAndUpdate({}, value, {
        new: true,
        upsert: true,
        runValidators: true,
    });

    clearCache(SITE_CONFIG_CACHE_KEY);

    res.status(200).json({
        message: "Site config updated successfully",
        data: config,
    });
};

exports.uploadHeroImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
    }

    const config = await SiteConfig.findOne();

    // Delete old hero image from Cloudinary if exists
    if (config && config.heroSection && config.heroSection.heroImage) {
        const oldPublicId = extractPublicIdFromUrl(config.heroSection.heroImage);
        await deleteFromCloudinary(oldPublicId);
    }

    const imageUrl = req.file.secure_url;

    const updatedConfig = await SiteConfig.findOneAndUpdate(
        {},
        { $set: { "heroSection.heroImage": imageUrl } },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
        },
    );

    clearCache(SITE_CONFIG_CACHE_KEY);

    res.status(200).json({
        message: "Hero image uploaded successfully",
        data: updatedConfig,
    });
};
