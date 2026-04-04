import { Component, inject } from '@angular/core';
import { NotificationToastService } from '../../../core/services/notification-toast.service';
import { INotificationToast } from '../../../core/models/notification-toast.model';

@Component({
  selector: 'app-notification-toast',
  imports: [],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.css',
})
export class NotificationToast {
  _toastService = inject(NotificationToastService);

  trackById(index: number, toast: INotificationToast) {
    return toast.id;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'new_order': return '📦';
      case 'low_stock': return '⚠️';
      case 'new_testimonial': return '⭐';
      case 'order_canceled': return '❌';
      default: return '🔔';
    }
  }

  getBorderColor(type: string): string {
    switch (type) {
      case 'new_order': return 'var(--info)';
      case 'low_stock': return 'var(--warning)';
      case 'new_testimonial': return 'var(--success)';
      case 'order_canceled': return 'var(--error)';
      default: return 'var(--text-light)';
    }
  }

  getBgColor(type: string): string {
    switch (type) {
      case 'new_order': return 'var(--info-bg)';
      case 'low_stock': return 'var(--warning-bg)';
      case 'new_testimonial': return 'var(--success-bg)';
      case 'order_canceled': return 'var(--error-bg)';
      default: return '#f5f5f5';
    }
  }
}
