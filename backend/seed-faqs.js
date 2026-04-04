require("dotenv").config();
const mongoose = require("mongoose");
const FAQ = require("./models/faq.model");

const seedFAQs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");

        const existingCount = await FAQ.countDocuments({ isDeleted: false });
        if (existingCount > 0) {
            console.log(`FAQs already exist (${existingCount} items). Skipping seed.`);
            process.exit(0);
        }

        const faqs = [
            {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption.",
                order: 1,
            },
            {
                question: "How long does shipping take?",
                answer: "Standard delivery takes 3-5 business days. Express shipping (1-2 business days) is available at checkout for an additional fee. Free shipping is available on all orders.",
                order: 2,
            },
            {
                question: "What is your return policy?",
                answer: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached. Please contact us to initiate a return.",
                order: 3,
            },
            {
                question: "Do you offer international shipping?",
                answer: "Currently, we ship within Egypt. We're working on expanding our shipping to other countries. Stay tuned for updates!",
                order: 4,
            },
            {
                question: "How do I track my order?",
                answer: "Once your order ships, you'll receive a confirmation email with a tracking number and link. You can also view your order status in the 'My Orders' section of your account.",
                order: 5,
            },
            {
                question: "Can I cancel or modify my order?",
                answer: "You can cancel your order before it enters the 'Preparing' stage. Once your order is being prepared or shipped, cancellation is no longer possible. Please contact us as soon as possible if you need to make changes.",
                order: 6,
            },
            {
                question: "Are your products true to size?",
                answer: "Our products are designed to fit true to size. We recommend checking the size guide on each product page for detailed measurements. If you're between sizes, we suggest sizing up for a more comfortable fit.",
                order: 7,
            },
            {
                question: "Do you offer gift wrapping?",
                answer: "Gift wrapping is not currently available. However, all orders are carefully packaged in our signature branding, making them gift-ready.",
                order: 8,
            },
            {
                question: "How do I contact customer support?",
                answer: "You can reach us via email at hello@aura.com or by phone at +20 100 123 4567. Our support team is available Sunday through Thursday, 9am to 6pm.",
                order: 9,
            },
            {
                question: "Do you have a physical store or showroom?",
                answer: "Our showroom is open by appointment only. Please contact us to schedule a visit. We'd love to show you our collections in person.",
                order: 10,
            },
        ];

        const result = await FAQ.insertMany(faqs);
        console.log(`Seeded ${result.length} FAQs successfully!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding FAQs:", error.message);
        process.exit(1);
    }
};

seedFAQs();
