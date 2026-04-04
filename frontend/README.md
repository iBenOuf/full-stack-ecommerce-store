# Frontend - Aura E-Commerce Store

Modern, mobile-responsive e-commerce storefront built with Angular 21 and TypeScript.

## 📋 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.1.0 | Frontend framework |
| TypeScript | 5.9.2 | Type safety |
| RxJS | 7.8.0 | Reactive programming (Observables) |
| Angular Router | 21.1.0 | Client-side routing (lazy-loaded) |
| Angular Forms | 21.1.0 | Reactive forms |
| Socket.io Client | 4.8.3 | Real-time admin notifications |
| JWT Decode | 4.0.0 | Token parsing |
| Vitest | 4.0.8 | Testing framework |
| jsdom | 27.1.0 | DOM for tests |

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (project uses npm@11.6.2)
- **Angular CLI** v21.1.4 (`npm install -g @angular/cli`)

## 🚀 Installation

### 1. Clone and Navigate
```bash
git clone https://github.com/iBenOuf/full-stack-ecommerce-store.git
cd full-stack-ecommerce-store/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Update `src/environments/environment.ts` for development:

```typescript
export const environment = {
  apiURL: 'http://localhost:3000/api/v1/',
  isProduction: false,
};
```

For production builds, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  apiURL: 'https://your-backend-url.com/api/v1/',
  isProduction: true,
};
```

**Note:** Angular CLI automatically uses `environment.prod.ts` when building with `--configuration production`.

### 4. Start Development Server
```bash
ng serve
```

Frontend runs at: `http://localhost:4200`

## 🎨 Features Breakdown

### Public Storefront

#### Home Page
- Hero section with seasonal promotions (configurable via admin)
- New Arrivals carousel (8 latest products)
- Best Sellers section (top 8 products by order count)
- About section with analytics stats (dynamic from site config)
- Customer testimonials with star ratings
- Review submission form (authenticated users)

#### Shop Page
- Product grid with pagination
- Sidebar with category/subcategory filters
- Search by product name (debounced)
- Sort options:
  - Newest First
  - Oldest First
  - Price: Low to High
  - Price: High to Low
  - Name: A–Z
  - Name: Z–A
  - Stock: Low to High
  - Stock: High to Low
- Mobile-responsive layout

#### Product Detail Page
- Large product image with hover zoom
- Product name, description, price
- Stock quantity indicator
- Quantity selector with +/- buttons
- Add to cart with optimistic update
- Related products (same subcategory)
- Accordion sections:
  - Product Details
  - Shipping & Returns (dynamic from site config)

#### Shopping Cart
- Cart items with product images
- Quantity adjustment (+/-) with instant UI update
- Remove items
- Order summary (subtotal, shipping, total)
- Free shipping indicator
- Continue shopping / Proceed to checkout
- Optimistic updates with debounced server sync (300ms)

#### Checkout
- Shipping address selection (saved addresses)
- Add new address form
- Delivery phone input
- Order summary sidebar
- Place order with validation
- Product availability check at checkout
- COD (Cash on Delivery) payment

#### Order Confirmation
- Order success message
- Order number and date
- Order status badge
- Items ordered list (with product snapshots)
- Delivery details
- Continue shopping / View orders links

#### User Account
- **Profile**: View/edit personal info, gender, phone
- **Addresses**: CRUD operations for saved addresses
- **Orders**: Order history with status tracking
  - Expandable order details
  - Item list with images (survives product deletion)
  - Order summary
  - Cancel order (for pending orders)

#### Authentication
- **Login**: Email/password with validation, dynamic brand name and stats
- **Register**: Full registration form with:
  - First name, last name
  - Email, password (min 8 chars)
  - Phone number
  - Gender selection
  - Terms acceptance
- **Guest Guard**: Redirects logged-in users from auth pages
- **Auth Guard**: Protects authenticated routes
- **Admin Guard**: Restricts admin dashboard access

### Admin Dashboard

#### Dashboard
- Sales analytics chart (revenue over time)
- Order statistics (pending, preparing, shipped, etc.)
- Low stock alerts
- Recent orders table
- Best-selling products

#### Product Management
- Product list with sidebar filters:
  - Search by name (debounced 400ms)
  - Category/subcategory filter
  - Status filter: All, Active, Deleted, Enabled, Disabled
  - Stock status filter: In Stock, Low Stock, Out of Stock
- Sort dropdown with 8 options
- Numbered pagination with ellipsis
- Toggle active/inactive status
- Clear all filters button
- Results count display

#### Category Management
- Category CRUD with image upload
- Toggle active/inactive status
- Soft delete support

#### Subcategory Management
- Subcategory CRUD
- Parent category assignment
- Image upload
- Toggle active/inactive status

#### Order Management
- All orders table with filters
- Order status update dropdown:
  - pending → preparing → shipped → delivered
  - canceled_by_admin
  - rejected, returned
- View order details
- Customer information
- Delivery address and phone

#### User Management
- User list with role badges
- Filter by role (customer, moderator, admin)
- Activate/deactivate users
- Soft delete support

#### Testimonials
- Customer review list
- Approve/reject testimonials
- Delete inappropriate reviews

#### FAQs
- FAQ CRUD
- Question/answer pairs
- Reorder FAQs

#### Dynamic Pages
- Create custom pages (About, Privacy, Terms, etc.)
- Rich text editor support (future)
- Slug-based routing

#### Site Settings
- **General** — Site name, announcement bar
- **Hero Section** — Title (3 lines), slogan, description, hero image upload, season badge
- **About Section** — Slogan, title, description, 4 analytics stats
- **Footer & Social** — Footer text, contact email/phone, copyright, social links, payment methods
- **Content** — Core values, shipping policy, footer links, nav links, shop page, contact page
- **Pages** — FAQ page content, 404 page content

#### Sales Reports
- Revenue analytics
- Order statistics
- Best sellers chart
- Date range filter

## 🏗️ Component Architecture

### Core Structure
```
src/app/
├── admin/              # Admin dashboard modules
│   ├── dashboard/
│   ├── manage-products/
│   ├── manage-orders/
│   └── ...
├── core/               # Singleton services, guards, models, pipes
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   ├── services/
│   └── pipes/
├── pages/              # Public pages
│   ├── home/
│   ├── shop/
│   ├── cart/
│   ├── checkout/
│   └── ...
├── shared/             # Reusable components
│   ├── header/
│   ├── footer/
│   └── components/
├── login/
├── register/
└── not-found/
```

### Key Components

#### Header Component
- Dynamic site name from site config
- Navigation links (dynamic from site config with optional query params)
- Categories from database
- Cart icon with badge count
- User account icon (login if guest)
- Mobile hamburger menu (768px breakpoint)
- Subcategory navigation bar

#### Footer Component
- Brand column with dynamic logo and description
- Shop links (dynamic from footerLinks in site config)
- Help links (dynamic from footerLinks)
- Company links (dynamic from footerLinks)
- Social media links
- Payment method badges
- Copyright text

#### Product Card Component
- Product image with hover effect
- Category label
- Product name
- Price display
- Low stock indicator
- Router link to product detail

#### Notification Toast Component
- Card-style toasts with type-specific icons
- Color-coded borders (info, warning, success, error)
- Slide-in animation from top-right
- No auto-dismiss (user-controlled)
- Close button per toast

## 🔄 State Management

### Services (RxJS Observables)

#### AuthService
```typescript
- login(email, password): Observable
- register(userData): Observable
- logout(): void
- getAuthData(): Observable<ITokenData>
- isLoggedIn(): boolean
```

#### ProductService
```typescript
- getProducts(filters): Observable
- getProductBySlug(slug): Observable
- getBestSellerProducts(limit): Observable
- getRelatedProducts(subcategoryId, limit): Observable
- getAdminProducts(filters): Observable
- createProduct(formData): Observable (admin)
- updateProduct(id, formData): Observable (admin)
```

#### CartService
```typescript
- cartData: Observable<ICart>
- cartCount: Observable<number>
- addToLocalCart(product, quantity): void
- updateLocalCartItemQuantity(product, quantity): void  // Optimistic + debounce
- removeLocalCartItem(product): void
- clearLocalCart(): void
- mergeLocalCartToServer(): Observable  // Called on login
- getServerCart(): Observable
```

#### OrderService
```typescript
- createOrder(orderData): Observable
- getUserOrders(userId): Observable
- getOrderById(id): Observable
- updateOrderStatus(id, status): Observable (admin)
```

#### NotificationService (Socket.io)
```typescript
- connect(token): void
- newNotification$: Observable<INotification>
- getAllNotifications(): Observable
- getUnreadCount(): Observable
- markAsRead(id): Observable
- markAllAsRead(): Observable
- disconnect(): void
```

#### NotificationToastService
```typescript
- toasts: Signal<INotificationToast[]>
- add(toast): void
- remove(id): void
- clear(): void
```

#### SiteConfigService
```typescript
- getSiteConfigData(): Observable<ISiteConfig>
- getConfigSnapshot(): ISiteConfig | null
- fetchConfig(): void
- updateConfig(data): Observable
- uploadHeroImage(file): Observable
```

### Local Storage
- **Cart**: Persisted for guest users
- **Auth Token**: JWT stored in localStorage
- **User Data**: Decoded JWT payload

## 🎨 Styling Approach

### CSS Architecture
- **No CSS framework** - Pure custom CSS
- **CSS Variables** for theming:
```css
:root {
  --cream: #faf8f5;
  --charcoal: #1a1a1a;
  --muted: #7a7570;
  --border: #e8e4df;
  --accent: #c9a96e;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Jost', sans-serif;
}
```

### Responsive Breakpoints
```css
/* Desktop First */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px) {  /* Mobile Landscape */ }
@media (max-width: 480px) {  /* Mobile Portrait */ }
```

### Component Styling
- Each component has its own `.css` file
- BEM-like naming convention
- Mobile-first responsive design
- Consistent spacing system

## 🧪 Development

### Start Development Server
```bash
ng serve
# or
npm start
```

Access at: `http://localhost:4200`

### Code Scaffolding
```bash
# Generate component
ng generate component components/component-name

# Generate service
ng generate services services/service-name

# Generate guard
ng generate guard guards/guard-name

# Generate model (class)
ng generate class models/model-name
```

### Run Tests
```bash
ng test
# or
npm test
```

### Build for Production
```bash
ng build --configuration production
# or
npm run build
```

Output: `dist/frontend/`

### Code Style
```bash
# Format with Prettier
npx prettier --write "src/**/*.ts"
```

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── admin.css
│   │   │   ├── admin.html
│   │   │   ├── admin.ts
│   │   │   ├── dashboard/
│   │   │   ├── manage-products/
│   │   │   ├── manage-orders/
│   │   │   ├── manage-categories/
│   │   │   ├── manage-subcategories/
│   │   │   ├── manage-users/
│   │   │   ├── manage-testimonials/
│   │   │   ├── manage-faqs/
│   │   │   ├── manage-pages/
│   │   │   ├── sales-reports/
│   │   │   └── site-settings/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth-guard.ts
│   │   │   │   ├── admin-guard.ts
│   │   │   │   └── guest-guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   ├── site-config.model.ts
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── notification-toast.service.ts
│   │   │   │   ├── site-config.service.ts
│   │   │   │   └── ...
│   │   │   └── pipes/
│   │   │       └── i18n.pipe.ts
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── shop/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── product-detail/
│   │   │   ├── order-confirmation/
│   │   │   ├── my-account/
│   │   │   │   ├── my-profile/
│   │   │   │   ├── my-addresses/
│   │   │   │   └── my-orders/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── testimonials/
│   │   │   └── dynamic-page/
│   │   ├── shared/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── components/
│   │   │       ├── product-card/
│   │   │       ├── toast/
│   │   │       └── notification-toast/
│   │   ├── login/
│   │   ├── register/
│   │   ├── not-found/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   │   └── ...
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css       # Global styles
│   ├── main.ts
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## 📈 Performance Optimizations

### Lazy Loading
All routes are lazy-loaded, significantly reducing the initial bundle size:

| Metric | Before | After |
|--------|--------|-------|
| Initial bundle | 880kB | 316kB |
| Main chunk | 874kB | 8kB |
| Transfer size | 164kB | 89kB |

### Change Detection
- Components use `ChangeDetectionStrategy.OnPush` where possible
- `ChangeDetectorRef.detectChanges()` called explicitly after async operations

### Cart Optimizations
- **Optimistic updates** — UI updates instantly on quantity change
- **Debounced sync** — Server requests batched with 300ms debounce
- **Product caching** — Cart page caches product details to avoid redundant API calls
- **Login-only merge** — Guest cart merges with server only on login

### Socket.io
- **Persistent connection** — Socket stays connected across admin page navigations
- **No disconnect on route change** — `ngOnDestroy` doesn't disconnect socket

## 🔧 Common Issues & Troubleshooting

### 1. Cannot Connect to Backend
```
Error: Connection refused to http://localhost:3000
```
**Solution:** Ensure backend server is running. Check `environment.ts` API URL.

### 2. CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Backend must include CORS middleware with frontend origin in allowed list.

### 3. JWT Token Not Working
```
401 Unauthorized: Invalid token
```
**Solution:** Token may be expired (1 day). User needs to login again. Check localStorage for `token`.

### 4. Images Not Loading
```
404 Not Found: Cloudinary URL
```
**Solution:** Check Cloudinary credentials in backend. Verify image upload succeeded.

### 5. Socket.io Connection Fails (Admin)
```
WebSocket connection failed
```
**Solution:** Ensure backend Socket.io is initialized. Admin token must be valid.

### 6. Build Fails with TypeScript Errors
```
error TS2345: Type 'X' is not assignable to type 'Y'
```
**Solution:** Run `npm install` to ensure all dependencies are installed. Check TypeScript version compatibility.

### 7. Mobile Menu Not Working
```
Hamburger click does nothing
```
**Solution:** Check browser console for errors. Ensure `mobileMenuOpen` state is updating correctly.

### 8. Cart Count Not Updating
```
Badge shows 0 after adding items
```
**Solution:** Cart service uses RxJS BehaviorSubject. Ensure `cartCount` observable is subscribed.

## 🚀 Deployment (Netlify)

### 1. Build for Production
```bash
ng build --configuration production
```

### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist/frontend/browser
```

### 3. Or Connect via Git
1. Push to GitHub
2. Connect repository on [Netlify](https://netlify.com)
3. Configure:
   - Build command: `ng build --configuration production`
   - Publish directory: `dist/frontend/browser`
4. Add environment variables:
   - `API_URL`: Backend production URL

### 4. Update Environment
In `environment.prod.ts`:
```typescript
export const environment = {
  apiURL: 'https://your-backend.onrender.com/api/v1/',
  isProduction: true,
};
```

## 📝 Code Examples

### Fetching Products
```typescript
// shop.ts
this._productService.getProducts({
  category: 'mens',
  subcategory: 'shirts',
  minPrice: 0,
  maxPrice: 100,
  sort: 'price_asc',
  page: 1,
  limit: 12
}).subscribe({
  next: (res) => {
    this.products = res.data.data;
    this.totalPages = res.data.totalPages;
  }
});
```

### Adding to Cart
```typescript
// product-detail.ts
addToCart() {
  this._cartService.addToLocalCart(this.product, this.quantity);
  // UI updates instantly, server sync happens in background
}
```

### Real-time Admin Notifications
```typescript
// dashboard.ts
ngOnInit() {
  const token = localStorage.getItem('token');
  this._notificationService.connect(token);
  
  this._notificationService.newNotification$.subscribe((data) => {
    this._toastService.success('New notification received!');
    this.loadDashboardStats();
  });
}
```

### Auth Guard
```typescript
// auth-guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

---

<div align="center">

**Built with Angular 21 & TypeScript**

[⬆ Back to Top](#frontend---aura-e-commerce-store)

</div>
