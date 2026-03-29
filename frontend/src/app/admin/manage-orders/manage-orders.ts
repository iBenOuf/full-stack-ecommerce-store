import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IOrder, OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  orders: IOrder[] = [];
  isLoading = true;
  isProcessing = false;
  expandedOrderId: string | null = null;

  statusOptions: OrderStatus[] = [
    'pending',
    'preparing',
    'shipped',
    'delivered',
    'canceled_by_admin',
    'rejected',
    'returned',
  ];

  constructor(
    private _orderService: OrderService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = (res.data as any).orders || res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => this.handleError('Failed to load orders'),
    });
  }

  toggleExpand(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  updateStatus(order: IOrder, newStatus: string) {
    if (order.status === newStatus) return;

    this.isProcessing = true;
    this._orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: () => {
        this._toastService.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
        this.loadOrders();
        this.isProcessing = false;
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to update order status');
        order.status = order.status;
        this.isProcessing = false;
        this._cdr.detectChanges();
      },
    });
  }

  calculateTotal(order: IOrder): number {
    return order.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }

  calculateSubtotal(order: IOrder): number {
    return order.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  getCustomerName(user: any): string {
    if (!user) return 'Guest';
    if (typeof user === 'string') return user;
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest';
  }

  getCustomerEmail(user: any): string {
    if (!user || typeof user === 'string') return '';
    return user.email || '';
  }

  private handleError(msg: string) {
    this._toastService.error(msg);
    this.isLoading = false;
    this._cdr.detectChanges();
  }
}
