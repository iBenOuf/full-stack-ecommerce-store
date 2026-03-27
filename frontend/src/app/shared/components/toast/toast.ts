import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { IToast } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  _toastService = inject(ToastService);

  trackById(index: number, toast: IToast) {
    return toast.id;
  }
}
