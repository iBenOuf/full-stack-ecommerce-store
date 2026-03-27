import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TestimonialService } from '../../core/services/testimonial.service';
import { ToastService } from '../../core/services/toast.service';
import { ITestimonial, TestimonialStatus } from '../../core/models/testimonial.model';

@Component({
  selector: 'app-manage-testimonials',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './manage-testimonials.html',
  styleUrl: './manage-testimonials.css',
})
export class ManageTestimonials implements OnInit {
  constructor(
    private _testimonialService: TestimonialService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef
  ) {}

  testimonials: ITestimonial[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.isLoading = true;
    this._testimonialService.getAllTestimonials().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.testimonials = res.data;
          this.isLoading = false;
          this._cdr.detectChanges();
        });
      },
      error: () => {
        setTimeout(() => {
          this.isLoading = false;
          this._toastService.error('Failed to load testimonials');
          this._cdr.detectChanges();
        });
      }
    });
  }

  updateStatus(id: string, status: TestimonialStatus) {
    this._testimonialService.updateTestimonialStatus(id, { status }).subscribe({
      next: () => {
        this._toastService.success(`Testimonial ${status}`);
        this.loadTestimonials();
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to update status');
      }
    });
  }

  deleteTestimonial(id: string) {
    if (confirm('Are you sure you want to permanently delete this testimonial?')) {
      this._testimonialService.deleteTestimonial(id).subscribe({
        next: () => {
          this._toastService.success('Testimonial deleted');
          this.loadTestimonials();
        },
        error: (err) => {
          this._toastService.error(err?.error?.message || 'Failed to delete testimonial');
        }
      });
    }
  }

  getFullName(t: ITestimonial): string {
    if (t.user && typeof t.user !== 'string' && t.user.firstName) {
      return `${t.user.firstName} ${t.user.lastName}`;
    }
    return 'Anonymous';
  }
}
