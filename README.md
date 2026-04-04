# Aura - Full-Stack E-Commerce Store

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.1.0-red.svg?logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg?logo=mongodb)](https://www.mongodb.com/)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-blue.svg)](https://ecommerce-store.benouf.dev)

> A modern, full-featured e-commerce platform with a complete admin dashboard, real-time notifications, dynamic content management, and mobile-responsive design.

**Live Demo:** [https://ecommerce-store.benouf.dev](https://ecommerce-store.benouf.dev)

---

## 📚 Documentation

| Documentation | Description |
|---------------|-------------|
| [🖥️ Frontend README](./frontend/README.md) | Angular 21 storefront, components, services, state management |
| [⚙️ Backend README](./backend/README.md) | Node.js/Express API, endpoints, database schema, authentication |

---

## ✨ Key Features

### 🛍️ Customer Features
- **User Authentication** - Secure JWT-based registration and login
- **Product Browsing** - Filter by category, subcategory, price range, and sort options
- **Shopping Cart** - Persistent cart with optimistic updates and debounced server sync
- **Order Management** - Track orders with status updates (pending → preparing → shipped → delivered)
- **Multiple Addresses** - Save and manage shipping addresses
- **Product Reviews** - Submit and view customer testimonials
- **Mobile Responsive** - Optimized for all device sizes
- **Real-time Notifications** - Socket.io powered order and stock alerts with toast notifications

### 👨‍ Admin Dashboard
- **Sales Analytics** - Revenue charts, order statistics, and best sellers
- **Product Management** - CRUD operations with Cloudinary image uploads, sidebar filters, search, sort, and pagination
- **Category Management** - Manage categories with toggle activation and image uploads
- **Subcategory Management** - Manage subcategories with parent category assignment
- **Order Management** - Update order status, view customer details
- **User Management** - View, manage, and toggle user activation
- **Content Management** - Manage FAQs, testimonials, dynamic pages
- **Site Configuration** - Customize hero section, announcements, footer, navigation links, core values, shipping policy, page content, and more
- **Real-time Updates** - Socket.io notifications for new orders, low stock, testimonials, and order cancellations

### 🔒 Security Features
- JWT authentication with role-based access control
- Password hashing with bcrypt
- Helmet.js security headers
- CORS configuration
- Input validation with Joi
- MongoDB injection protection

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.1.0 | Frontend framework |
| TypeScript | 5.9.2 | Type safety |
| RxJS | 7.8.0 | Reactive programming |
| Socket.io Client | 4.8.3 | Real-time notifications |
| JWT Decode | 4.0.0 | Token handling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime environment |
| Express | 5.2.1 | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 9.2.3 | ODM |
| Socket.io | 4.8.3 | Real-time communication |
| JWT | 9.0.3 | Authentication |
| Bcrypt | 6.0.0 | Password hashing |
| Cloudinary | 1.41.3 | Image hosting |
| Winston | 3.19.0 | Logging |
| Helmet | 8.1.0 | Security headers |
| Node-Cache | 5.1.2 | In-memory caching |

### DevOps & Deployment
- **Frontend:** Netlify (CI/CD, SSL, CDN)
- **Backend:** Render (Auto-deploy, SSL)
- **Database:** MongoDB Atlas (Cloud-hosted)
- **Images:** Cloudinary (CDN, transformations)

---

## 📦 Quick Start

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/iBenOuf/full-stack-ecommerce-store.git
cd full-stack-ecommerce-store
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
```

**Required Environment Variables:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database (MongoDB Atlas connection string)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Admin Credentials (first admin account)
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

# CORS
ALLOWED_ORIGINS=http://localhost:4200

# Cloudinary (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

```bash
# Seed the database (optional but recommended for fresh installs)
node seed.js

# Start development server
npm run dev
```

Backend runs at: `http://localhost:3000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Update environment.ts with backend URL
```

```bash
# Start development server
npm start
```

Frontend runs at: `http://localhost:4200`

---

## 🌱 Database Seeding

The project includes an interactive seed script to bootstrap your database with default content:

```bash
cd backend
node seed.js
```

**Available seeds:**
1. **Site Config** - Hero section, about analytics, footer text, social links, core values, shipping policy, nav links, footer links, page content (shop, contact, FAQ, 404)
2. **FAQs** - 10 common e-commerce questions
3. **Pages** - Privacy Policy, Terms of Service, Shipping Policy, Return Policy

You can select individual seeds or all at once. Seeds are idempotent — they skip if data already exists.

---

## 🌐 Deployment

### Backend (Render)
1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add all environment variables from `.env.example`
6. Deploy!

### Frontend (Netlify)
1. Create new site on [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/dist/frontend/browser`
5. Update `environment.ts` with production backend URL
6. Deploy!

---

## 📁 Project Structure

```
full-stack-ecommerce-store/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers (14 controllers)
│   ├── middlewares/      # Auth, validation, pagination, caching
│   ├── models/          # Mongoose schemas (12 models)
│   ├── routes/          # API endpoints (14 routes)
│   ├── utils/           # Helpers (bcrypt, socket, errors, cloudinary, cache)
│   ├── seed.js          # Interactive database seeder
│   ├── seed-site-config.js
│   ├── seed-faqs.js
│   ├── seed-pages.js
│   ├── .env.example     # Environment template
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── admin/       # Admin dashboard components
│   │   ├── core/        # Guards, interceptors, models, services, pipes
│   │   ├── pages/       # Public pages (home, shop, cart, etc.)
│   │   ├── shared/      # Reusable components (header, footer, toast)
│   │   ├── login/       # Authentication pages
│   │   └── app.routes.ts
│   ├── src/environments/
│   ├── angular.json
│   └── package.json
│
├── README.md            # This file
├── LICENSE              # MIT License
└── .gitignore
```

---

## 📚 API Documentation

The API is organized into RESTful endpoints with **67 endpoints** across 15 modules.

### Interactive Documentation
Swagger UI is available at `/api-docs` when the backend is running:
- **Live:** [https://api.ecommerce-store.benouf.dev/api-docs](https://api.ecommerce-store.benouf.dev/api-docs)
- **Development:** `http://localhost:3000/api-docs`

### Static Documentation
| Documentation | Description |
|---------------|-------------|
| [📖 OpenAPI Spec](./docs/api/openapi.yaml) | Machine-readable OpenAPI 3.0 specification |
| [📝 API Reference](./docs/api/API.md) | Human-readable endpoint reference |

| Module | Route | Description |
|--------|-------|-------------|
| Auth | `/api/v1/auth` | Register, login, get current user |
| Products | `/api/v1/product` | CRUD, filtering, best sellers |
| Categories | `/api/v1/category` | Category management with activation toggle |
| Subcategories | `/api/v1/subcategory` | Subcategory management with activation toggle |
| Orders | `/api/v1/order` | Create, track, manage orders |
| Cart | `/api/v1/cart` | Shopping cart operations, merge guest cart |
| Address | `/api/v1/address` | User addresses |
| Users | `/api/v1/user` | User management (admin) |
| Testimonials | `/api/v1/testimonial` | Customer reviews |
| Site Config | `/api/v1/site-config` | Site customization, hero image upload |
| Pages | `/api/v1/page` | Dynamic content pages |
| FAQ | `/api/v1/faq` | FAQ management |
| Notifications | `/api/v1/notification` | Real-time alerts |
| Reports | `/api/v1/report` | Sales analytics |

---

## ⚡ Performance

This project has been optimized for speed and efficiency:

### Frontend
- **Lazy Loading** — All routes are lazy-loaded, reducing initial bundle by **64%** (880kB → 316kB)
- **OnPush Change Detection** — Components use `ChangeDetectionStrategy.OnPush` to minimize re-renders
- **Optimistic UI Updates** — Cart quantity changes update instantly without waiting for server response
- **Debounced Server Sync** — Cart updates batched with 300ms debounce to reduce API calls
- **Product Caching** — Cart page caches product details to avoid redundant API calls

### Backend
- **Database Indexes** — All frequently queried fields are indexed (slug, isActive, isDeleted, category, user, createdAt)
- **In-Memory Caching** — Product lists and site config cached with Node-Cache
- **Pagination Middleware** — Efficient pagination with configurable sort, filter, and limit
- **Cloudinary Image Optimization** — Automatic quality optimization and format conversion (WebP)

### Socket.io
- **Persistent Connection** — Socket stays connected across admin page navigations
- **Reconnection Handling** — Automatic reconnection with configurable attempts

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📋 Changelog

### Recent Updates

#### Performance & Architecture
- **Lazy Loading Routes** — All routes now lazy-loaded, initial bundle reduced by 64%
- **Database Indexes** — Added indexes to all models for faster queries
- **In-Memory Caching** — Product lists and site config cached with Node-Cache
- **Socket Reconnection** — Persistent socket connection across admin page navigations

#### Cart Improvements
- **Optimistic Updates** — Cart quantity changes update UI instantly
- **Debounced Server Sync** — 300ms debounce prevents rapid-click race conditions
- **Login-Only Merge** — Guest cart merges with server cart only on login (not on every page refresh)
- **Order Snapshots** — Order items store product name/image snapshot so order history survives product deletions

#### Content Management
- **Dynamic Site Config** — All text content manageable from admin: core values, shipping policy, footer links, nav links, page content (shop, contact, FAQ, 404)
- **Interactive Seed Scripts** — `node seed.js` for bootstrapping fresh databases
- **Dynamic Footer** — Footer links rendered from database, not hardcoded
- **Dynamic Nav Links** — Navbar links configurable from admin with optional query params

#### Admin Dashboard
- **Manage Products Overhaul** — Sidebar filters, search, category/subcategory filters, status filters, stock status filters, numbered pagination
- **Availability Toggles** — Toggle isActive on categories, subcategories, and products
- **Notification Toasts** — Real-time toast notifications for new orders, low stock, testimonials, and cancellations
- **Site Settings Overhaul** — Tabs for General, Hero, About, Footer & Social, Content, and Pages

#### Notifications
- **Fixed Socket Event Mismatch** — Backend now emits specific event types matching frontend listeners
- **Order Cancellation Alerts** — Admin notified when customer cancels an order
- **Low Stock Alerts** — Triggered on product create/update and after order placement
- **Toast Notification System** — Card-style toasts with type-specific icons, no auto-dismiss

#### Bug Fixes
- **Cloudinary Upload Fix** — Fixed `req.file.path` → `req.file.secure_url` for all image uploads
- **Inactive Subcategory Handling** — Product detail page handles null subcategory gracefully
- **Cart Quantity Persistence** — Fixed quantity resetting on page refresh
- **Merge Cart Doubling** — Fixed cart quantities doubling on page refresh

---

<div align="center">

**Made with Angular 21 & Node.js/Express**

[⬆ Back to Top](#aura---full-stack-e-commerce-store)

</div>
