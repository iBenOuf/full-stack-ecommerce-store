require("dotenv").config();
const mongoose = require("mongoose");
const Page = require("./models/page.model");

const seedPages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");

        const existingCount = await Page.countDocuments({ isDeleted: false });
        if (existingCount > 0) {
            console.log(`Pages already exist (${existingCount} items). Skipping seed.`);
            process.exit(0);
        }

        const pages = [
            {
                pageSlug: "privacy-policy",
                title: "Privacy Policy",
                content: `<h2>Privacy Policy</h2>
<p>Last updated: April 2026</p>
<p>At Aura, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.</p>

<h3>Information We Collect</h3>
<p>We collect information that you provide directly to us, including:</p>
<ul>
<li>Name, email address, phone number, and shipping address</li>
<li>Payment information (processed securely through our payment providers)</li>
<li>Order history and preferences</li>
<li>Communications you send to us</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
<li>Process and fulfill your orders</li>
<li>Send you order confirmations and shipping updates</li>
<li>Respond to your comments and questions</li>
<li>Send you marketing communications (with your consent)</li>
<li>Improve our website and services</li>
</ul>

<h3>Information Sharing</h3>
<p>We do not sell your personal information. We may share your information with trusted service providers who assist us in operating our website, processing payments, and fulfilling orders.</p>

<h3>Data Security</h3>
<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>

<h3>Contact Us</h3>
<p>If you have questions about this Privacy Policy, please contact us at hello@aura.com.</p>`,
                order: 1,
            },
            {
                pageSlug: "terms-of-service",
                title: "Terms of Service",
                content: `<h2>Terms of Service</h2>
<p>Last updated: April 2026</p>
<p>By accessing and using the Aura website, you accept and agree to be bound by these Terms of Service.</p>

<h3>Use of Website</h3>
<p>You may use our website for lawful purposes only. You agree not to:</p>
<ul>
<li>Use the website in any way that violates applicable laws</li>
<li>Attempt to gain unauthorized access to our systems</li>
<li>Interfere with the proper working of the website</li>
</ul>

<h3>Products and Pricing</h3>
<p>All product descriptions, images, and pricing are subject to change without notice. We reserve the right to discontinue any product at any time.</p>

<h3>Orders and Payment</h3>
<p>By placing an order, you agree to provide accurate and complete information. Payment must be made in full at the time of purchase. We reserve the right to refuse or cancel any order.</p>

<h3>Shipping and Delivery</h3>
<p>Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.</p>

<h3>Returns and Refunds</h3>
<p>Returns are accepted within 14 days of delivery. Items must be in their original condition. Refunds will be processed to the original payment method within 7-10 business days.</p>

<h3>Limitation of Liability</h3>
<p>Aura shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>

<h3>Contact</h3>
<p>For questions about these terms, contact us at hello@aura.com.</p>`,
                order: 2,
            },
            {
                pageSlug: "shipping-policy",
                title: "Shipping Policy",
                content: `<h2>Shipping Policy</h2>
<p>Last updated: April 2026</p>

<h3>Free Shipping</h3>
<p>We offer free standard shipping on all orders within Egypt. No minimum purchase required.</p>

<h3>Delivery Times</h3>
<ul>
<li><strong>Standard Delivery:</strong> 3-5 business days</li>
<li><strong>Express Delivery:</strong> 1-2 business days (available at checkout for an additional fee)</li>
</ul>

<h3>Order Processing</h3>
<p>Orders are processed within 24 hours of placement. Orders placed after 2pm will be processed the next business day.</p>

<h3>Tracking Your Order</h3>
<p>Once your order ships, you'll receive an email with a tracking number. You can also track your order in the "My Orders" section of your account.</p>

<h3>Shipping Restrictions</h3>
<p>Currently, we only ship within Egypt. We're working on expanding to other countries — stay tuned!</p>

<h3>Lost or Damaged Packages</h3>
<p>If your package is lost or arrives damaged, please contact us within 48 hours of the expected delivery date. We'll work with the carrier to resolve the issue.</p>`,
                order: 3,
            },
            {
                pageSlug: "return-policy",
                title: "Return & Exchange Policy",
                content: `<h2>Return & Exchange Policy</h2>
<p>Last updated: April 2026</p>

<h3>Return Window</h3>
<p>We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.</p>

<h3>How to Return</h3>
<ol>
<li>Contact us at hello@aura.com or call +20 100 123 4567</li>
<li>Provide your order number and the items you wish to return</li>
<li>We'll provide a return shipping label</li>
<li>Pack the items securely and ship them back</li>
</ol>

<h3>Refunds</h3>
<p>Refunds are processed to the original payment method within 7-10 business days after we receive and inspect the returned items.</p>

<h3>Exchanges</h3>
<p>We offer exchanges for different sizes or colors. Contact us to arrange an exchange. If the desired item is unavailable, we'll issue a refund instead.</p>

<h3>Non-Returnable Items</h3>
<p>For hygiene reasons, certain items may not be eligible for return. This will be clearly indicated on the product page.</p>

<h3>Sale Items</h3>
<p>Sale items are eligible for return under the same conditions as regular-priced items.</p>`,
                order: 4,
            },
        ];

        const result = await Page.insertMany(pages);
        console.log(`Seeded ${result.length} pages successfully!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding pages:", error.message);
        process.exit(1);
    }
};

seedPages();
