require("dotenv").config();
const mongoose = require("mongoose");
const SiteConfig = require("./models/site-config.model");

const seedSiteConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");

        let config = await SiteConfig.findOne();
        if (!config) {
            config = new SiteConfig({});
            console.log("Created new site config document");
        }

        const defaults = {
            announcement: "FREE SHIPPING · NEW ARRIVALS EVERY FRIDAY",
            siteName: "Maison & Co",
            heroSection: {
                heroSlogan: "Spring / Summer 2026",
                heroTitle: {
                    line1: "Wear the",
                    line2: "season",
                    line3: "with ease",
                },
                heroDescription: "New arrivals crafted for those who move through the world with quiet confidence. Thoughtful fabrics, considered cuts.",
                season: "SS '26",
                heroImage: "",
            },
            aboutSection: {
                aboutSlogan: "Our Promise",
                aboutTitle: {
                    line1: "Crafted to",
                    line2: "last",
                    line3: ", designed to feel good",
                },
                aboutDescription: "Every piece is made with sustainably sourced materials and produced in small batches by artisan workshops in Portugal and Italy.",
                analytics: {
                    stat1: { value: "100%", label: "Natural fibres" },
                    stat2: { value: "12+", label: "Artisan workshops" },
                    stat3: { value: "0", label: "Fast fashion" },
                    stat4: { value: "3yr", label: "Repair guarantee" },
                },
            },
            footerSection: {
                footerText: "Thoughtfully crafted clothing for the modern wardrobe. Timeless pieces, considered design.",
                socialLinks: [
                    { name: "facebook", url: "https://facebook.com" },
                    { name: "instagram", url: "https://instagram.com" },
                    { name: "tiktok", url: "https://tiktok.com" },
                    { name: "pinterest", url: "https://pinterest.com" },
                ],
                contactEmail: "hello@maisonco.com",
                contactPhone: "+20 100 123 4567",
                copyrightText: "© 2026 Maison & Co. All rights reserved.",
                paymentMethods: [
                    { name: "visa" },
                    { name: "MASTERCARD" },
                    { name: "PAYPAL" },
                    { name: "STRIPE" },
                ],
            },
            coreValues: [
                {
                    icon: "✦",
                    title: { en: "Craftsmanship" },
                    description: { en: "Every piece is crafted with care and precision, honoring traditional techniques while embracing modern aesthetics." },
                },
                {
                    icon: "♻",
                    title: { en: "Sustainability" },
                    description: { en: "We are committed to sustainable practices — from responsible sourcing to eco-conscious packaging." },
                },
                {
                    icon: "◈",
                    title: { en: "Timelessness" },
                    description: { en: "We design for longevity. Our collections transcend trends and are built to be worn for years to come." },
                },
                {
                    icon: "◎",
                    title: { en: "Inclusivity" },
                    description: { en: "Fashion is for everyone. We celebrate diverse bodies, styles, and stories in everything we do." },
                },
            ],
            shippingPolicy: {
                title: { en: "Shipping & Returns" },
                freeShipping: { en: "Free shipping" },
                standardDelivery: { en: "Standard delivery: 3-5 business days" },
                returnsPolicy: { en: "Returns accepted within 14 days of delivery" },
                returnsDays: 14,
            },
            footerLinks: [
                {
                    section: { en: "Shop" },
                    links: [
                        { label: { en: "New Arrivals" }, url: "/shop" },
                        { label: { en: "Best Sellers" }, url: "/shop" },
                        { label: { en: "Collections" }, url: "/shop" },
                    ],
                },
                {
                    section: { en: "Help" },
                    links: [
                        { label: { en: "Track My Order" }, url: "/my-orders" },
                        { label: { en: "FAQs" }, url: "/faq" },
                        { label: { en: "Contact Us" }, url: "/contact" },
                    ],
                },
                {
                    section: { en: "Company" },
                    links: [
                        { label: { en: "About Us" }, url: "/about" },
                        { label: { en: "Privacy Policy" }, url: "/p/privacy-policy" },
                        { label: { en: "Terms of Service" }, url: "/p/terms-of-service" },
                    ],
                },
            ],
            shopPage: {
                heading: { en: "The Collection" },
                subtitle: { en: "Thoughtfully made, designed to last" },
            },
            contactPage: {
                eyebrow: { en: "We'd Love to Hear From You" },
                heading: { en: "Get in Touch" },
                subtitle: { en: "Have a question about your order, our products, or just want to say hello? We're here to help." },
                emailHeading: { en: "Email Us" },
                emailDesc: { en: "Drop us a line anytime, we aim to respond within 24 hours." },
                phoneHeading: { en: "Call Us" },
                phoneDesc: { en: "Available Sunday – Thursday, 9am – 6pm." },
                visitHeading: { en: "Visit Us" },
                visitDesc: { en: "Our showroom is open by appointment." },
                socialEyebrow: { en: "Follow Along" },
                socialHeading: { en: "Find Us on Social Media" },
                faqText: { en: "Got a quick question?" },
                faqLinkText: { en: "View our FAQs" },
            },
            faqPage: {
                heading: { en: "Frequently Asked Questions" },
                subtitle: { en: "Find answers to common questions about our products, shipping, and returns." },
                footerText: { en: "Still have questions?" },
                footerButtonText: { en: "Contact Us" },
            },
            notFoundPage: {
                eyebrow: { en: "Page not found" },
                heading: { en: "Lost in the wardrobe" },
                subtitle: { en: "The page you're looking for seems to have gone out of style. Let's get you back to something beautiful." },
                suggestionsHeading: { en: "You might be looking for" },
                suggestions: [
                    { label: { en: "New Arrivals" }, url: "/shop?filter=new" },
                    { label: { en: "Dresses" }, url: "/shop" },
                    { label: { en: "Outerwear" }, url: "/shop" },
                    { label: { en: "Sale" }, url: "/shop?sale=true" },
                    { label: { en: "My Orders" }, url: "/my-orders" },
                ],
            },
            navLinks: [
                { label: { en: "New In" }, url: "/shop", queryParams: { sort: "createdAtDESC" } },
                { label: { en: "Collections" }, url: "/shop" },
            ],
        };

        for (const [key, value] of Object.entries(defaults)) {
            const isEmpty = Array.isArray(config[key])
                ? config[key].length === 0
                : !config[key] || Object.keys(config[key]).length === 0 || Object.values(config[key]).every(v => !v || (typeof v === 'object' && !v.en));

            if (isEmpty) {
                config[key] = value;
                console.log(`  ✓ Set default for: ${key}`);
            } else {
                console.log(`  - Already exists with data: ${key}`);
            }
        }

        await config.save();
        console.log("\nSite config seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding site config:", error.message);
        process.exit(1);
    }
};

seedSiteConfig();
