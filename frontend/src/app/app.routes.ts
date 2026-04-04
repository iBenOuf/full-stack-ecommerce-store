import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pages').then((m) => m.Pages),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'Home | Aura' },
      { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About), title: 'Our Story | Aura' },
      { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop), title: 'Shop | Aura' },
      { path: 'product/:slug', loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail), title: 'Product | Aura' },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart), title: 'Shopping Cart | Aura' },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout), canActivate: [authGuard], title: 'Checkout | Aura' },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact), title: 'Contact Us | Aura' },
      { path: 'faq', loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq), title: 'FAQs | Aura' },
      { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials').then((m) => m.Testimonials), title: 'Testimonials | Aura' },
      {
        path: 'my-account',
        loadComponent: () => import('./pages/my-account/my-account').then((m) => m.MyAccount),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', loadComponent: () => import('./pages/my-account/my-profile/my-profile').then((m) => m.MyProfile), title: 'My Profile | Aura' },
          { path: 'addresses', loadComponent: () => import('./pages/my-account/my-addresses/my-addresses').then((m) => m.MyAddresses), title: 'My Addresses | Aura' },
          { path: 'orders', loadComponent: () => import('./pages/my-account/my-orders/my-orders').then((m) => m.MyOrders), title: 'My Orders | Aura' },
        ],
      },
      { path: 'order-confirmation/:id', loadComponent: () => import('./pages/order-confirmation/order-confirmation').then((m) => m.OrderConfirmation), canActivate: [authGuard], title: 'Order Confirmed | Aura' },
      { path: 'p/:slug', loadComponent: () => import('./pages/dynamic-page/dynamic-page').then((m) => m.DynamicPage), title: 'Aura' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard), title: 'Dashboard | Aura Admin' },
      { path: 'manage-products', loadComponent: () => import('./admin/manage-products/manage-products').then((m) => m.ManageProducts), title: 'Products | Aura Admin' },
      { path: 'manage-categories', loadComponent: () => import('./admin/manage-categories/manage-categories').then((m) => m.ManageCategories), title: 'Categories | Aura Admin' },
      { path: 'manage-subcategories', loadComponent: () => import('./admin/manage-subcategories/manage-subcategories').then((m) => m.ManageSubcategories), title: 'Subcategories | Aura Admin' },
      { path: 'manage-orders', loadComponent: () => import('./admin/manage-orders/manage-orders').then((m) => m.ManageOrders), title: 'Orders | Aura Admin' },
      { path: 'manage-users', loadComponent: () => import('./admin/manage-users/manage-users').then((m) => m.ManageUsers), title: 'Users | Aura Admin' },
      { path: 'manage-testimonials', loadComponent: () => import('./admin/manage-testimonials/manage-testimonials').then((m) => m.ManageTestimonials), title: 'Testimonials | Aura Admin' },
      { path: 'manage-faqs', loadComponent: () => import('./admin/manage-faqs/manage-faqs').then((m) => m.ManageFaqs), title: 'FAQs | Aura Admin' },
      { path: 'manage-pages', loadComponent: () => import('./admin/manage-pages/manage-pages').then((m) => m.ManagePages), title: 'Pages | Aura Admin' },
      { path: 'sales-reports', loadComponent: () => import('./admin/sales-reports/sales-reports').then((m) => m.SalesReports), title: 'Sales Reports | Aura Admin' },
      { path: 'site-settings', loadComponent: () => import('./admin/site-settings/site-settings').then((m) => m.SiteSettings), title: 'Site Settings | Aura Admin' },
    ],
  },
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login), canActivate: [guestGuard], title: 'Sign In | Aura' },
  { path: 'register', loadComponent: () => import('./register/register').then((m) => m.Register), canActivate: [guestGuard], title: 'Create Account | Aura' },
  { path: 'not-found', loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound), title: 'Page Not Found | Aura' },
  { path: '**', redirectTo: 'not-found' },
];
