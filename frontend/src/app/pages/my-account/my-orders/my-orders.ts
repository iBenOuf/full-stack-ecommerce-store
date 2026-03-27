import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IOrder, OrderStatus } from '../../../core/models/order.model';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { NgClass } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ITokenData } from '../../../core/models/auth.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-my-orders',
  imports: [NgClass, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders {
  constructor(
    private _orderService: OrderService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private _cartService: CartService,
    private _router: Router,
  ) {}

  orders: IOrder[] = [];
  userData!: ITokenData | null;
  isLoading = true;
  isReordering = false;
  expandedOrderId: string | null = null;
  skeletons = ['a', 'b', 'c', 'd'];
  staticFilesURL = environment.staticFilesURL;

  ngOnInit(): void {
    this._authService.getAuthData().subscribe((data) => {
      this.userData = data;
      this.loadOrders();
    });
  }

  private loadOrders(): void {
    this.isLoading = true;
    this.isLoading = false;
    this._cdr.detectChanges();
    this._orderService.getOrdersByUserId(this.userData?._id!).subscribe({
      next: (res) => {
        this.orders = res.data ?? [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this._toastService.error('Failed to load orders');
        this._cdr.detectChanges();
      },
    });
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  cancelOrder(orderId: string): void {
    this.orders = this.orders.map((order) =>
      order._id === orderId ? { ...order, status: 'canceled_by_client' } : order,
    );

    this._orderService.updateOrderStatus(orderId, 'canceled_by_client').subscribe({
      next: () => {
        this.loadOrders();
        this._toastService.success('Order cancelled');
        this._cdr.detectChanges();
      },
      error: (err) => this._toastService.error(err?.error?.message || 'Failed to cancel order'),
    });
  }

  reorder(orderId: string): void {
    if (this.isReordering) return;
    this.isReordering = true;

    this._orderService.reorder(orderId).subscribe({
      next: (res) => {
        this.isReordering = false;
        if (res.data && res.data.cart) {
          this._cartService.replaceCart(res.data.cart);
        }
        this._toastService.success('Items added to cart successfully');
        this._router.navigate(['/cart']);
      },
      error: (err) => {
        this.isReordering = false;
        this._toastService.error(err?.error?.message || 'Failed to re-order items');
        this._cdr.detectChanges();
      },
    });
  }

  getOrderTotal(order: IOrder): number {
    return order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pending',
      preparing: 'Preparing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      canceled_by_client: 'Cancelled',
      canceled_by_admin: 'Cancelled',
      rejected: 'Rejected',
      returned: 'Returned',
    };
    return labels[status];
  }

  getStatusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'pending',
      preparing: 'preparing',
      shipped: 'shipped',
      delivered: 'delivered',
      canceled_by_client: 'canceled',
      canceled_by_admin: 'canceled',
      rejected: 'rejected',
      returned: 'returned',
    };
    return map[status];
  }
}
