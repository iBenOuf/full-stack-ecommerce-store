# Backend - Maison & Co E-Commerce API

RESTful API server built with Node.js, Express, and MongoDB for a full-featured e-commerce platform.

## 📋 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 5.2.1 | Web framework |
| MongoDB | Atlas (v7+) | Database |
| Mongoose | 9.2.3 | ODM |
| Socket.io | 4.8.3 | Real-time notifications |
| JWT | 9.0.3 | Authentication |
| Bcrypt | 6.0.0 | Password hashing |
| Cloudinary | 1.41.3 | Image hosting |
| Winston | 3.19.0 | Logging |
| Helmet | 8.1.0 | Security headers |
| Joi | 18.0.2 | Validation |
| Multer | 2.1.0 | File uploads |
| Node-Cache | 5.1.2 | In-memory caching |

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier for image hosting)

## 🚀 Installation

### 1. Clone and Navigate
```bash
git clone https://github.com/iBenOuf/full-stack-ecommerce-store.git
cd full-stack-ecommerce-store/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Admin Credentials (first admin account)
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:4200

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Seed the Database (Optional)

Bootstrap your database with default content:
```bash
node seed.js
```

This interactive seeder lets you choose what to seed:
- **Site Config** — Hero section, analytics, footer, nav links, core values, shipping policy, page content
- **FAQs** — 10 common e-commerce questions
- **Pages** — Privacy Policy, Terms of Service, Shipping Policy, Return Policy

Seeds are idempotent — they skip if data already exists.

### 5. Start Development Server
```bash
npm run dev
```

Server runs at: `http://localhost:3000`

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String (1-30 chars, required),
  lastName: String (1-30 chars, required),
  email: String (unique, required, lowercase),
  password: String (min 8 chars, hashed),
  role: "customer" | "moderator" | "admin",
  phone: String (optional),
  gender: "male" | "female",
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String (max 200, required),
  slug: String (unique, required),
  description: String (max 2000, required),
  price: Number (min 0, required),
  stockQuantity: Number (min 0, required),
  imageUrl: String (Cloudinary URL, required),
  subcategory: ObjectId (ref: Subcategory),
  category: ObjectId (ref: Category, auto-populated),
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  timestamps: true
}
```

### Category Model
```javascript
{
  name: String (max 50, required),
  slug: String (unique, required),
  imageUrl: String,
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  timestamps: true
}
```

### Subcategory Model
```javascript
{
  name: String (max 50, required),
  slug: String (unique, required),
  category: ObjectId (ref: Category, required),
  image: String,
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  timestamps: true
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product),
    snapshot: {
      name: String,
      imageUrl: String
    },
    quantity: Number (min 1),
    unitPrice: Number (min 0)
  }],
  shippingAddress: {
    street: String,
    city: String,
    governorate: String
  },
  deliveryPhone: String (required),
  status: "pending" | "preparing" | "shipped" | "delivered" | "canceled_by_client" | "canceled_by_admin" | "rejected" | "returned",
  timestamps: true
}
```

### Site Config Model
```javascript
{
  announcement: String,
  siteName: String,
  heroSection: { heroSlogan, heroTitle: { line1, line2, line3 }, heroDescription, heroImage, season },
  aboutSection: { aboutSlogan, aboutTitle: { line1, line2, line3 }, aboutDescription, analytics: { stat1-4: { value, label } } },
  footerSection: { footerText, socialLinks: [{ name, url }], contactEmail, contactPhone, paymentMethods: [{ name }], copyrightText },
  coreValues: [{ icon, title: { en }, description: { en } }],
  shippingPolicy: { title: { en }, freeShipping: { en }, standardDelivery: { en }, returnsPolicy: { en }, returnsDays: Number },
  footerLinks: [{ section: { en }, links: [{ label: { en }, url }] }],
  shopPage: { heading: { en }, subtitle: { en } },
  contactPage: { eyebrow, heading, subtitle, emailHeading, emailDesc, phoneHeading, phoneDesc, visitHeading, visitDesc, socialEyebrow, socialHeading, faqText, faqLinkText },
  faqPage: { heading, subtitle, footerText, footerButtonText },
  notFoundPage: { eyebrow, heading, subtitle, suggestionsHeading, suggestions: [{ label: { en }, url }] },
  navLinks: [{ label: { en }, url, queryParams: Object }]
}
```

### Other Models
- **Cart** — User shopping cart with items array
- **Address** — User saved addresses
- **Testimonial** — Customer reviews with rating
- **Page** — Dynamic content pages (About, Privacy, etc.)
- **FAQ** — Frequently asked questions
- **Notification** — Real-time admin notifications (new_order, low_stock, new_testimonial, order_canceled)

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789",
  "gender": "male"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Products (`/api/v1/product`)

#### Create Product (Admin Only)
```http
POST /api/v1/product
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

name: "Classic White Shirt"
slug: "classic-white-shirt"
description: "Premium cotton shirt"
price: 49.99
stockQuantity: 100
subcategoryId: "..."
image: <file>
```

#### Get Products (Public)
```http
GET /api/v1/product/list?category=...&subcategory=...&minPrice=0&maxPrice=100&sort=price_asc&page=1&limit=12
```

#### Get Product by Slug
```http
GET /api/v1/product/slug/:slug
```

#### Get Best Sellers
```http
GET /api/v1/product/best-sellers?limit=8
```

#### Update Product (Admin Only)
```http
PUT /api/v1/product/:id
Authorization: Bearer <admin-token>
```

#### Delete Product (Admin Only)
```http
DELETE /api/v1/product/:id
Authorization: Bearer <admin-token>
```

### Orders (`/api/v1/order`)

#### Create Order
```http
POST /api/v1/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Cairo",
    "governorate": "Cairo"
  },
  "deliveryPhone": "0123456789"
}
```

#### Get User Orders
```http
GET /api/v1/order/user/:id
Authorization: Bearer <token>
```

#### Get Order Details
```http
GET /api/v1/order/details/:id
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PATCH /api/v1/order/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "shipped"
}
```

#### Get All Orders (Admin Only)
```http
GET /api/v1/order?page=1&limit=20&status=pending
```

### Cart (`/api/v1/cart`)

#### Get Cart
```http
GET /api/v1/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/v1/cart/items
Authorization: Bearer <token>

{
  "productId": "...",
  "quantity": 2
}
```

#### Update Cart Item
```http
PATCH /api/v1/cart/items/:productId
Authorization: Bearer <token>

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/v1/cart/items/:productId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/v1/cart
Authorization: Bearer <token>
```

#### Merge Guest Cart (Called on Login)
```http
POST /api/v1/cart/merge
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": "...", "quantity": 2, "unitPrice": 49.99 }
  ]
}
```

### Categories (`/api/v1/category`)

```http
GET    /api/v1/category          # Get all categories (public)
POST   /api/v1/category          # Create (admin)
PUT    /api/v1/category/:id      # Update (admin)
DELETE /api/v1/category/:id      # Delete (admin)
```

### Subcategories (`/api/v1/subcategory`)

```http
GET    /api/v1/subcategory          # Get all (public)
GET    /api/v1/subcategory/category/:categoryId  # Get by category
POST   /api/v1/subcategory          # Create (admin)
PUT    /api/v1/subcategory/:id      # Update (admin)
DELETE /api/v1/subcategory/:id      # Delete (admin)
```

### Users (`/api/v1/user`)

```http
GET    /api/v1/user          # Get all users (admin)
GET    /api/v1/user/:id      # Get user by ID (admin)
PUT    /api/v1/user/:id      # Update user (admin)
DELETE /api/v1/user/:id      # Delete user (admin)
```

### Site Config (`/api/v1/site-config`)

```http
GET    /api/v1/site-config          # Get site configuration (public)
POST   /api/v1/site-config          # Create/Update (admin)
POST   /api/v1/site-config/upload-hero  # Upload hero image (admin)
```

### Testimonials (`/api/v1/testimonial`)

```http
GET    /api/v1/testimonial          # Get approved testimonials (public)
POST   /api/v1/testimonial          # Create testimonial (auth user)
PUT    /api/v1/testimonial/:id      # Update/approve (admin)
DELETE /api/v1/testimonial/:id      # Delete (admin)
```

### Dynamic Pages (`/api/v1/page`)

```http
GET    /api/v1/page/slug/:slug      # Get page by slug (public)
POST   /api/v1/page                 # Create page (admin)
PUT    /api/v1/page/:id             # Update page (admin)
DELETE /api/v1/page/:id             # Delete page (admin)
```

### FAQs (`/api/v1/faq`)

```http
GET    /api/v1/faq                  # Get all FAQs (public)
POST   /api/v1/faq                  # Create FAQ (admin)
PUT    /api/v1/faq/:id              # Update FAQ (admin)
DELETE /api/v1/faq/:id              # Delete FAQ (admin)
```

### Notifications (`/api/v1/notification`)

```http
GET    /api/v1/notification          # Get all notifications (admin)
GET    /api/v1/notification/unread-count  # Get unread count (admin)
PUT    /api/v1/notification/:id/read    # Mark as read (admin)
PUT    /api/v1/notification/read-all    # Mark all as read (admin)
DELETE /api/v1/notification/:id         # Delete (admin)
```

### Reports (`/api/v1/report`)

```http
GET    /api/v1/report/sales         # Get sales analytics (admin)
```

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User registers/logs in → receives JWT token
2. Token included in Authorization header: `Bearer <token>`
3. Backend validates token via `authenticate` middleware
4. User data attached to `req.user`

### Role-Based Access Control
```javascript
// Middleware usage
router.post(
  "/product",
  authenticate,      // Verify JWT
  authorize("admin"), // Check role
  createProduct
);
```

**Roles:**
- `customer` - Browse, purchase, manage own data
- `moderator` - Customer + manage testimonials, FAQs
- `admin` - Full access to all endpoints

### Socket.io Authentication
Admin-only Socket.io connection for real-time notifications:
- Token-based authentication
- Only admin/moderator roles can connect
- Notifications sent to "admins" room
- Event types: `new_order`, `low_stock`, `new_testimonial`, `order_canceled`

## 📈 Database Indexes

All models have optimized indexes for fast queries:

| Model | Indexed Fields |
|-------|---------------|
| Product | `isActive+isDeleted`, `subcategory+isActive+isDeleted`, `category+isActive+isDeleted`, `slug`, `name+description` (text), `createdAt`, `price`, `stockQuantity` |
| Category | `isActive+isDeleted`, `slug` |
| Subcategory | `category+isActive+isDeleted`, `slug`, `isActive+isDeleted` |
| Order | `user+createdAt`, `status+createdAt`, `createdAt` |
| User | `role+isActive`, `email` |
| Cart | `user` (unique) |
| Testimonial | `status+isDeleted+createdAt`, `user` |
| FAQ | `isActive+isDeleted+order` |
| Page | `pageSlug+isActive+isDeleted` |
| Notification | `isRead+createdAt` |

## 🧪 Testing

Currently, tests are not implemented. To add tests:

```bash
# Install testing dependencies
npm install --save-dev jest supertest mongodb-memory-server

# Add to package.json scripts
"test": "jest"

# Run tests
npm test
```

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.config.js          # MongoDB connection
├── controllers/
│   ├── auth.controller.js    # Login, register, getMe
│   ├── product.controller.js # CRUD, filtering, best sellers
│   ├── order.controller.js   # Create, track, update status
│   ├── cart.controller.js    # Cart operations, merge
│   ├── category.controller.js
│   ├── subcategory.controller.js
│   ├── user.controller.js    # User management (admin)
│   ├── testimonial.controller.js
│   ├── page.controller.js
│   ├── site-config.controller.js
│   ├── faq.controller.js
│   ├── notification.controller.js
│   ├── address.controller.js
│   └── report.controller.js  # Sales analytics
├── middlewares/
│   ├── auth.middleware.js    # JWT verification
│   ├── role.middleware.js    # Role-based authorization
│   ├── validate-objectid.middleware.js
│   ├── upload.middleware.js  # Multer + Cloudinary
│   ├── cors.middleware.js
│   ├── error-handler.middleware.js
│   └── paginate.middleware.js # Pagination with sort, filter, status
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   ├── cart.model.js
│   ├── category.model.js
│   ├── subcategory.model.js
│   ├── address.model.js
│   ├── testimonial.model.js
│   ├── page.model.js
│   ├── site-config.model.js
│   ├── faq.model.js
│   └── notification.model.js
├── routes/
│   ├── auth.route.js
│   ├── product.route.js
│   ├── order.route.js
│   ├── cart.route.js
│   ├── category.route.js
│   ├── subcategory.route.js
│   ├── user.route.js
│   ├── testimonial.route.js
│   ├── page.route.js
│   ├── site-config.route.js
│   ├── faq.route.js
│   ├── notification.route.js
│   ├── address.route.js
│   └── report.route.js
├── utils/
│   ├── bcrypt.utils.js       # Password hashing
│   ├── jwt.utils.js          # Token generation
│   ├── cloudinary.js         # Image upload/delete
│   ├── socket.utils.js       # Socket.io setup
│   ├── notification.utils.js # Create notifications
│   ├── cache.utils.js        # Cache management
│   ├── err.utils.js          # AppError class
│   └── catch-async.utils.js  # Async error wrapper
├── seed.js                   # Interactive database seeder
├── seed-site-config.js
├── seed-faqs.js
├── seed-pages.js
├── .env.example
├── server.js                 # Entry point
├── package.json
└── README.md
```

## 🔧 Common Issues & Troubleshooting

### 1. MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution:** Check MongoDB Atlas connection string in `.env`. Ensure IP whitelist includes your server IP or set to `0.0.0.0/0`.

### 2. Cloudinary Upload Error
```
Cloudinary: Invalid API Key or Secret
```
**Solution:** Verify Cloudinary credentials in `.env`. Get them from [Cloudinary Dashboard](https://cloudinary.com/console).

### 3. JWT Token Expired
```
JsonWebTokenError: jwt expired
```
**Solution:** Token expires after 1 day (configurable via `JWT_EXPIRES_IN`). User needs to login again.

### 4. CORS Error (Frontend Can't Connect)
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Update `ALLOWED_ORIGINS` in `.env` to include frontend URL (e.g., `http://localhost:4200,https://yourdomain.com`).

### 5. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change `PORT` in `.env` or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### 6. Image Upload Fails
```
Multer error: No file uploaded
```
**Solution:** Ensure form data uses `multipart/form-data` and field name is `image`.

### 7. Socket.io Connection Fails
```
Authentication error: Not authorized
```
**Solution:** Socket.io is admin-only. Ensure user has admin/moderator role and valid token.

### 8. Cart Merge Fails
```
400 Bad Request: "items[0]._id" is not allowed
```
**Solution:** Ensure merge request sends clean data: `{ items: [{ productId: "...", quantity: 1, unitPrice: 49.99 }] }`. Product objects should not be populated.

## 🚀 Deployment (Render)

1. **Create Web Service** on [Render](https://render.com)
2. **Connect Repository** from GitHub
3. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables** from `.env.example`
5. **Deploy!**

Render provides:
- Automatic HTTPS
- Auto-deploy on git push
- Free tier: 750 hours/month

## 📝 Code Examples

### Creating a Product (Admin)
```javascript
// POST /api/v1/product
// Headers: Authorization: Bearer <admin-token>, Content-Type: multipart/form-data

const formData = new FormData();
formData.append('name', 'Classic White Shirt');
formData.append('slug', 'classic-white-shirt');
formData.append('description', 'Premium 100% cotton shirt');
formData.append('price', '49.99');
formData.append('stockQuantity', '100');
formData.append('subcategoryId', '60d5ec49f1b2c30015a3e2b8');
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/api/v1/product', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

### Placing an Order
```javascript
// POST /api/v1/order
// Headers: Authorization: Bearer <token>, Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Cairo",
    "governorate": "Cairo Governorate"
  },
  "deliveryPhone": "+201234567890"
}
```

### Real-time Notification (Socket.io)
```javascript
// Frontend (Admin Dashboard)
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: adminToken }
});

socket.on('new_order', (data) => {
  console.log('New order received:', data);
  // Show notification, update dashboard, etc.
});

socket.on('low_stock', (data) => {
  console.log('Low stock alert:', data);
});

socket.on('order_canceled', (data) => {
  console.log('Order canceled:', data);
});
```

### Seeding the Database
```bash
# Interactive seeder
node seed.js

# Or run individual seeds
node seed-site-config.js
node seed-faqs.js
node seed-pages.js
```

---

<div align="center">

**Built with Node.js, Express & MongoDB**

[⬆ Back to Top](#backend---maison--co-e-commerce-api)

</div>
