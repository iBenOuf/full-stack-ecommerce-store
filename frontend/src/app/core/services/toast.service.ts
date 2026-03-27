import { Injectable, signal } from '@angular/core';
import { IToast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<IToast[]>([]);
  private counter = 0;

  private add(message: string, type: ToastType, duration = 3500) {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { id, message, type }]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  success(message: string) {
    this.add(message, 'success');
  }
  error(message: string) {
    this.add(message, 'error');
  }
  warning(message: string) {
    this.add(message, 'warning');
  }
  info(message: string) {
    this.add(message, 'info');
  }
}
