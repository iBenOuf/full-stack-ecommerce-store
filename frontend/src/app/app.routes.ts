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
      { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart) },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout), canActivate: [authGuard] },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
      { path: 'faq', loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq) },
      { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      {
        path: 'my-account',
        loadComponent: () => import('./pages/my-account/my-account').then((m) => m.MyAccount),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', loadComponent: () => import('./pages/my-account/my-profile/my-profile').then((m) => m.MyProfile) },
          { path: 'addresses', loadComponent: () => import('./pages/my-account/my-addresses/my-addresses').then((m) => m.MyAddresses) },
          { path: 'orders', loadComponent: () => import('./pages/my-account/my-orders/my-orders').then((m) => m.MyOrders) },
        ],
      },
      { path: 'product/:slug', loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail) },
      { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
      { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials').then((m) => m.Testimonials) },
      { path: 'order-confirmation/:id', loadComponent: () => import('./pages/order-confirmation/order-confirmation').then((m) => m.OrderConfirmation), canActivate: [authGuard] },
      { path: 'p/:slug', loadComponent: () => import('./pages/dynamic-page/dynamic-page').then((m) => m.DynamicPage) },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'manage-categories', loadComponent: () => import('./admin/manage-categories/manage-categories').then((m) => m.ManageCategories) },
      { path: 'manage-orders', loadComponent: () => import('./admin/manage-orders/manage-orders').then((m) => m.ManageOrders) },
      { path: 'manage-pages', loadComponent: () => import('./admin/manage-pages/manage-pages').then((m) => m.ManagePages) },
      { path: 'manage-products', loadComponent: () => import('./admin/manage-products/manage-products').then((m) => m.ManageProducts) },
      { path: 'manage-subcategories', loadComponent: () => import('./admin/manage-subcategories/manage-subcategories').then((m) => m.ManageSubcategories) },
      { path: 'manage-testimonials', loadComponent: () => import('./admin/manage-testimonials/manage-testimonials').then((m) => m.ManageTestimonials) },
      { path: 'manage-faqs', loadComponent: () => import('./admin/manage-faqs/manage-faqs').then((m) => m.ManageFaqs) },
      { path: 'manage-users', loadComponent: () => import('./admin/manage-users/manage-users').then((m) => m.ManageUsers) },
      { path: 'sales-reports', loadComponent: () => import('./admin/sales-reports/sales-reports').then((m) => m.SalesReports) },
      { path: 'site-settings', loadComponent: () => import('./admin/site-settings/site-settings').then((m) => m.SiteSettings) },
    ],
  },
  { path: 'not-found', loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound) },
  { path: 'register', loadComponent: () => import('./register/register').then((m) => m.Register), canActivate: [guestGuard] },
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login), canActivate: [guestGuard] },
  { path: '**', redirectTo: 'not-found' },
];
