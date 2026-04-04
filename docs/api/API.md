# Maison & Co — API Reference

**Base URL:** `https://your-backend-url.com/api/v1`

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via `/auth/login` or `/auth/register` and expire after **1 day**.

### Roles

| Role | Permissions |
|------|-------------|
| `customer` | Browse, purchase, manage own data |
| `moderator` | Customer + manage testimonials, FAQs |
| `admin` | Full access to all endpoints |

---

## Pagination

List endpoints support these query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `sort` | string | `createdAtDESC` | Sort: `createdAtASC`, `createdAtDESC`, `priceASC`, `priceDESC`, `nameASC`, `nameDESC`, `stockASC`, `stockDESC` |
| `filter` | string | — | Search term (searches name and description) |
| `categorySlug` | string | — | Filter by category slug |
| `subcategorySlug` | string | — | Filter by subcategory slug |
| `inStock` | string | — | Set to `true` to show only in-stock items |
| `status` | string | — | Filter by status |
| `stockStatus` | string | — | Filter: `in`, `low`, `out` |

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| `400` | Validation error |
| `401` | Invalid credentials / incorrect password |
| `403` | Unauthorized (wrong role or ownership) |
| `404` | Resource not found |
| `409` | Conflict (slug/email already exists) |
| `500` | Internal server error |

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

---

## Endpoints

### Health

#### `GET /`
Check API status.

**Auth:** None

**Response:**
```json
{
  "message": "API is running",
  "status": "ok",
  "timestamp": "2026-04-04T12:00:00.000Z"
}
```

---

### Auth

#### `POST /auth/register`
Register a new customer.

**Auth:** None

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789",
  "gender": "male"
}
```

**Response (201):**
```json
{
  "message": "Registered successfully",
  "data": { "_id": "...", "firstName": "John", ... }
}
```

#### `POST /auth/login`
Authenticate and receive JWT token.

**Auth:** None

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `GET /auth/me`
Get current user profile.

**Auth:** Required

#### `POST /auth/register/moderator`
Register a new moderator (admin only).

**Auth:** Admin

#### `POST /auth/register/admin`
Register a new admin (admin only).

**Auth:** Admin

---

### Users

#### `GET /user/all`
Get all users.

**Auth:** Admin

#### `GET /user/:id`
Get user by ID. Users can fetch themselves; admins can fetch anyone.

**Auth:** Required

#### `PUT /user/:id`
Update user. Users can only update themselves.

**Auth:** Required

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "0987654321",
  "gender": "female"
}
```

#### `PATCH /user/:id/password`
Update password.

**Auth:** Required

**Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

#### `PUT /user/:id/status`
Change user active status.

**Auth:** Admin

**Body:**
```json
{
  "isActive": false
}
```

#### `DELETE /user/:id`
Soft-delete a user.

**Auth:** Admin

---

### Products

#### `POST /product`
Create a new product.

**Auth:** Admin

**Content-Type:** `multipart/form-data`

**Fields:**
- `name` (string, required)
- `slug` (string, required)
- `description` (string, required)
- `price` (number, required)
- `stockQuantity` (integer, required)
- `subcategoryId` (string, required)
- `image` (file, required)

#### `PUT /product/:id`
Update a product.

**Auth:** Admin

**Content-Type:** `multipart/form-data` (image is optional)

**Additional fields:** `isActive` (boolean)

#### `DELETE /product/:id`
Soft-delete a product.

**Auth:** Admin

#### `GET /product/list`
Get paginated products (public, active only).

**Auth:** None

**Query params:** `page`, `limit`, `sort`, `filter`, `categorySlug`, `subcategorySlug`, `inStock`

#### `GET /product/admin`
Get paginated products (admin view, includes deleted/inactive).

**Auth:** Admin

**Query params:** All pagination params + `status`, `stockStatus`

#### `GET /product/best-sellers`
Get best-selling products.

**Auth:** None

**Query params:** `limit` (default: 10)

#### `GET /product/slug/:slug`
Get product by slug.

**Auth:** None

#### `GET /product/id/:id`
Get product by ID.

**Auth:** None

#### `GET /product/related`
Get related products by subcategory.

**Auth:** None

**Query params:** `productId` (required), `subcategoryId` (required)

---

### Orders

#### `POST /order`
Create a new order from cart items.

**Auth:** Required

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Cairo",
    "governorate": "Cairo"
  },
  "deliveryPhone": "0123456789"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "data": { "_id": "...", "items": [...], ... },
  "unavailableItems": [
    { "productId": "...", "reason": "no longer available" }
  ]
}
```

#### `GET /order`
Get all orders.

**Auth:** Admin/Moderator

#### `GET /order/user/:id`
Get orders by user ID.

**Auth:** Required (users can only view their own)

#### `GET /order/details/:id`
Get order details.

**Auth:** Required (users can only view their own)

#### `PATCH /order/:id`
Update order status. Customers can only cancel; admins can set any status.

**Auth:** Required

**Body:**
```json
{
  "status": "shipped"
}
```

**Allowed statuses:** `pending`, `preparing`, `shipped`, `delivered`, `canceled_by_client`, `canceled_by_admin`, `rejected`, `returned`

#### `POST /order/reorder/:id`
Re-order from a previous order (adds items to cart).

**Auth:** Required

---

### Cart

#### `GET /cart`
Get current user's cart.

**Auth:** Required

#### `POST /cart`
Add item to cart.

**Auth:** Required

**Body:**
```json
{
  "productId": "...",
  "quantity": 2
}
```

#### `PUT /cart`
Update cart item quantity.

**Auth:** Required

**Body:**
```json
{
  "productId": "...",
  "quantity": 3
}
```

#### `DELETE /cart/item/:productId`
Remove item from cart.

**Auth:** Required

#### `DELETE /cart`
Clear cart.

**Auth:** Required

#### `POST /cart/merge`
Merge guest cart with server cart (called automatically on login).

**Auth:** Required

**Body:**
```json
{
  "items": [
    { "productId": "...", "quantity": 2, "unitPrice": 49.99 }
  ]
}
```

---

### Categories

#### `POST /category/add`
Create category.

**Auth:** Admin

**Content-Type:** `multipart/form-data`

**Fields:** `name`, `slug`, `image` (required), `isActive` (optional)

#### `PUT /category/update/:id`
Update category.

**Auth:** Admin

#### `DELETE /category/delete/:id`
Soft-delete category.

**Auth:** Admin

#### `GET /category/all`
Get all active categories.

**Auth:** None

#### `GET /category/all/admin`
Get all categories (admin view).

**Auth:** Admin

#### `GET /category/by-id/:id` / `GET /category/by-slug/:slug`
Get category by ID or slug.

**Auth:** None

#### `GET /category/by-id/admin/:id` / `GET /category/by-slug/admin/:slug`
Get category by ID or slug (admin view).

**Auth:** Admin

---

### Subcategories

#### `POST /subcategory`
Create subcategory.

**Auth:** Admin

**Content-Type:** `multipart/form-data`

**Fields:** `name`, `slug`, `categoryId`, `image` (required)

#### `PUT /subcategory/:id`
Update subcategory.

**Auth:** Admin

#### `DELETE /subcategory/:id`
Soft-delete subcategory.

**Auth:** Admin

#### `GET /subcategory`
Get all active subcategories.

**Auth:** None

#### `GET /subcategory/admin`
Get all subcategories (admin view).

**Auth:** Admin

#### `GET /subcategory/category?slug=...`
Get subcategories by category slug.

**Auth:** None

#### `GET /subcategory/admin/category?slug=...`
Get subcategories by category slug (admin view).

**Auth:** Admin

#### `GET /subcategory/:slug` / `GET /subcategory/admin/:slug`
Get subcategory by slug.

**Auth:** None / Admin

---

### Addresses

#### `POST /address/add`
Add a new address.

**Auth:** Required

**Body:**
```json
{
  "label": "Home",
  "street": "123 Main St",
  "city": "Cairo",
  "governorate": "Cairo",
  "isDefault": true
}
```

#### `GET /address/my-addresses`
Get all addresses for current user.

**Auth:** Required

#### `GET /address/by-id/:id`
Get address by ID.

**Auth:** Required (must own the address)

#### `PUT /address/update/:id`
Update address.

**Auth:** Required (must own the address)

#### `DELETE /address/delete/:id`
Delete address.

**Auth:** Required (must own the address)

#### `PATCH /address/default/:id`
Set address as default.

**Auth:** Required (must own the address)

---

### Testimonials

#### `GET /testimonial`
Get all approved testimonials.

**Auth:** None

#### `POST /testimonial`
Submit a new testimonial.

**Auth:** Required

**Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

#### `GET /testimonial/admin`
Get all testimonials with optional status filter.

**Auth:** Admin/Moderator

**Query params:** `status` (`pending`, `approved`, `rejected`)

#### `PATCH /testimonial/:id/status`
Update testimonial approval status.

**Auth:** Admin/Moderator

**Body:**
```json
{
  "status": "approved"
}
```

#### `DELETE /testimonial/:id`
Soft-delete testimonial.

**Auth:** Admin

---

### FAQs

#### `GET /faq`
Get all active FAQs.

**Auth:** None

#### `GET /faq/admin`
Get all FAQs including inactive.

**Auth:** Admin

#### `POST /faq`
Create a new FAQ.

**Auth:** Admin

**Body:**
```json
{
  "question": "What is your return policy?",
  "answer": "We accept returns within 14 days...",
  "order": 1,
  "isActive": true
}
```

#### `PUT /faq/:id`
Update FAQ.

**Auth:** Admin

#### `DELETE /faq/:id`
Soft-delete FAQ.

**Auth:** Admin

---

### Pages

#### `GET /page/:slug`
Get page by slug.

**Auth:** None

#### `GET /page`
Get all non-deleted pages.

**Auth:** Admin

#### `POST /page`
Create a new page.

**Auth:** Admin

**Body:**
```json
{
  "pageSlug": "privacy-policy",
  "title": "Privacy Policy",
  "content": "<h2>Privacy Policy</h2><p>...</p>",
  "isActive": true
}
```

#### `PUT /page/:id`
Update page.

**Auth:** Admin

#### `DELETE /page/:id`
Soft-delete page.

**Auth:** Admin

---

### Notifications

#### `GET /notification`
Get all notifications (latest 50).

**Auth:** Admin/Moderator

#### `GET /notification/unread-count`
Get count of unread notifications.

**Auth:** Admin/Moderator

**Response:**
```json
{
  "message": "Unread count fetched successfully",
  "data": { "count": 5 }
}
```

#### `PATCH /notification/read-all`
Mark all notifications as read.

**Auth:** Admin/Moderator

#### `PATCH /notification/:id/read`
Mark a single notification as read.

**Auth:** Admin/Moderator

#### `DELETE /notification/:id`
Delete a notification.

**Auth:** Admin/Moderator

---

### Site Config

#### `GET /site-config`
Get site configuration (cached 24h).

**Auth:** None

#### `PUT /site-config`
Update site configuration.

**Auth:** Admin

**Body:** Full or partial `SiteConfig` object. See OpenAPI spec for complete schema.

#### `POST /site-config/upload-hero`
Upload a hero image.

**Auth:** Admin

**Content-Type:** `multipart/form-data`

**Fields:** `heroImage` (file, required)

---

### Reports

#### `GET /report`
Get comprehensive sales report.

**Auth:** Admin

**Query params:** `startDate`, `endDate` (ISO date strings)

**Response:**
```json
{
  "message": "Sales report generated successfully",
  "data": {
    "summary": {
      "totalSales": 15000,
      "totalOrders": 120,
      "totalItemsSold": 350,
      "totalCustomers": 85,
      "totalProducts": 45
    },
    "topProducts": [
      { "_id": "...", "name": "Product A", "totalSold": 50, "revenue": 2500 }
    ],
    "salesTrends": [
      { "_id": "2026-04-01", "dailySales": 1200, "orderCount": 10 }
    ],
    "recentOrders": [...],
    "lowStockProducts": [...],
    "categoryDistribution": [...]
  }
}
```

---

### Socket.io Events

Connect to the base URL with your JWT token:

```javascript
import { io } from 'socket.io-client';

const socket = io('https://your-backend-url.com', {
  auth: { token: 'your-jwt-token' }
});
```

**Events received by admin/moderator:**

| Event | Description |
|-------|-------------|
| `new_order` | New order placed |
| `low_stock` | Product stock is low (≤5) |
| `new_testimonial` | New testimonial submitted |
| `order_canceled` | Customer canceled their order |

---

## OpenAPI Spec

For the complete machine-readable specification, see [`openapi.yaml`](./openapi.yaml).

You can view it interactively using:
- [Swagger Editor](https://editor.swagger.io/) — paste the YAML file
- [Redoc](https://redocly.github.io/redoc/) — host it yourself
- Swagger UI — add to your backend with `swagger-ui-express`
