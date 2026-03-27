import { Routes } from '@angular/router';
import { Pages } from './pages/pages';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Checkout } from './pages/checkout/checkout';
import { Login } from './login/login';
import { Register } from './register/register';
import { Shop } from './pages/shop/shop';
import { NotFound } from './not-found/not-found';
import { Faq } from './pages/faq/faq';
import { MyAccount } from './pages/my-account/my-account';
import { MyOrders } from './pages/my-account/my-orders/my-orders';
import { Testimonials } from './pages/testimonials/testimonials';
import { Admin } from './admin/admin';
import { Dashboard } from './admin/dashboard/dashboard';
import { ManageCategories } from './admin/manage-categories/manage-categories';
import { ManageOrders } from './admin/manage-orders/manage-orders';
import { ManagePages } from './admin/manage-pages/manage-pages';
import { ManageProducts } from './admin/manage-products/manage-products';
import { ManageSubcategories } from './admin/manage-subcategories/manage-subcategories';
import { ManageTestimonials } from './admin/manage-testimonials/manage-testimonials';
import { ManageUsers } from './admin/manage-users/manage-users';
import { SalesReports } from './admin/sales-reports/sales-reports';
import { SiteSettings } from './admin/site-settings/site-settings';
import { ManageFaqs } from './admin/manage-faqs/manage-faqs';
import { Cart } from './pages/cart/cart';
import { ProductDetail } from './pages/product-detail/product-detail';
import { MyAddresses } from './pages/my-account/my-addresses/my-addresses';
import { MyProfile } from './pages/my-account/my-profile/my-profile';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { OrderConfirmation } from './pages/order-confirmation/order-confirmation';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';

export const routes: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'about', component: About },
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },
      { path: 'contact', component: Contact },
      { path: 'faq', component: Faq },
      { path: 'home', component: Home },
      {
        path: 'my-account',
        component: MyAccount,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: MyProfile },
          { path: 'addresses', component: MyAddresses },
          { path: 'orders', component: MyOrders },
        ],
      },
      { path: 'product/:slug', component: ProductDetail },
      { path: 'shop', component: Shop },
      { path: 'testimonials', component: Testimonials },
      { path: 'order-confirmation/:id', component: OrderConfirmation, canActivate: [authGuard] },
      { path: 'p/:slug', component: DynamicPage },
    ],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'manage-categories', component: ManageCategories },
      { path: 'manage-orders', component: ManageOrders },
      { path: 'manage-pages', component: ManagePages },
      { path: 'manage-products', component: ManageProducts },
      { path: 'manage-subcategories', component: ManageSubcategories },
      { path: 'manage-testimonials', component: ManageTestimonials },
      { path: 'manage-faqs', component: ManageFaqs },
      { path: 'manage-users', component: ManageUsers },
      { path: 'sales-reports', component: SalesReports },
      { path: 'site-settings', component: SiteSettings },
    ],
  },
  { path: 'not-found', component: NotFound },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: '**', redirectTo: 'not-found' },
];
