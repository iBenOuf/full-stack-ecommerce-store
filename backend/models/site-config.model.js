const mongoose = require("mongoose");

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
    },
    { timestamps: true },
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
