import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { IOrder } from '../../core/models/order.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit {
  constructor(
    private _orderService: OrderService,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
  ) {}

  order: IOrder | null = null;
  isLoading = true;
  orderId: string | null = null;
  staticFilesURL = environment.staticFilesURL;

  get subtotal(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  ngOnInit(): void {
    this.orderId = this._route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this._orderService.getOrderById(this.orderId).subscribe({
        next: (res) => {
          this.order = res.data as IOrder;
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
    } else {
      this.isLoading = false;
    }
  }
}
