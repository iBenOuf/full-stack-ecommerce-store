import { Injectable, signal } from '@angular/core';
import { INotificationToast } from '../models/notification-toast.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationToastService {
  toasts = signal<INotificationToast[]>([]);
  private counter = 0;

  add(toast: Omit<INotificationToast, 'id'>) {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { ...toast, id }]);
  }

  remove(id: number) {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
