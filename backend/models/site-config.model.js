const mongoose = require("mongoose");

const i18nString = {
    en: { type: String, trim: true },
};

const siteConfigSchema = new mongoose.Schema(
    {
        announcement: { type: String, trim: true },
        siteName: { type: String, trim: true },
        heroSection: {
            heroSlogan: { type: String, trim: true },
            heroTitle: {
                line1: { type: String, trim: true },
                line2: { type: String, trim: true },
                line3: { type: String, trim: true },
            },
            heroDescription: { type: String, trim: true },
            heroImage: { type: String },
            season: { type: String, trim: true },
        },
        aboutSection: {
            aboutSlogan: { type: String, trim: true },
            aboutTitle: {
                line1: { type: String, trim: true },
                line2: { type: String, trim: true },
                line3: { type: String, trim: true },
            },
            aboutDescription: { type: String, trim: true },
            analytics: {
                stat1: {
                    value: { type: String, trim: true },
                    label: { type: String, trim: true },
                },
                stat2: {
                    value: { type: String, trim: true },
                    label: { type: String, trim: true },
                },
                stat3: {
                    value: { type: String, trim: true },
                    label: { type: String, trim: true },
                },
                stat4: {
                    value: { type: String, trim: true },
                    label: { type: String, trim: true },
                },
            },
        },
        footerSection: {
            footerText: { type: String, trim: true },
            socialLinks: [
                {
                    name: { type: String, trim: true },
                    url: { type: String, trim: true },
                },
            ],
            contactEmail: { type: String, trim: true, lowercase: true },
            contactPhone: { type: String, trim: true },
            paymentMethods: [
                {
                    name: { type: String, trim: true },
                },
            ],
            copyrightText: { type: String, trim: true },
        },
        coreValues: [
            {
                icon: { type: String, trim: true },
                title: i18nString,
                description: i18nString,
            },
        ],
        shippingPolicy: {
            title: i18nString,
            freeShipping: i18nString,
            standardDelivery: i18nString,
            returnsPolicy: i18nString,
            returnsDays: { type: Number, default: 14 },
        },
        footerLinks: [
            {
                section: i18nString,
                links: [
                    {
                        label: i18nString,
                        url: { type: String, trim: true },
                    },
                ],
            },
        ],
        shopPage: {
            heading: i18nString,
            subtitle: i18nString,
        },
        contactPage: {
            eyebrow: i18nString,
            heading: i18nString,
            subtitle: i18nString,
            emailHeading: i18nString,
            emailDesc: i18nString,
            phoneHeading: i18nString,
            phoneDesc: i18nString,
            visitHeading: i18nString,
            visitDesc: i18nString,
            socialEyebrow: i18nString,
            socialHeading: i18nString,
            faqText: i18nString,
            faqLinkText: i18nString,
        },
        faqPage: {
            heading: i18nString,
            subtitle: i18nString,
            footerText: i18nString,
            footerButtonText: i18nString,
        },
    notFoundPage: {
        eyebrow: i18nString,
        heading: i18nString,
        subtitle: i18nString,
        suggestionsHeading: i18nString,
        suggestions: [
            {
                label: i18nString,
                url: { type: String, trim: true },
            },
        ],
    },
    navLinks: [
        {
            label: i18nString,
            url: { type: String, trim: true },
            queryParams: { type: mongoose.Schema.Types.Mixed },
        },
    ],
    },
    { timestamps: true },
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
