import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { TestimonialService } from '../../core/services/testimonial.service';
import { ITestimonial } from '../../core/models/testimonial.model';
import { SiteConfigService } from '../../core/services/site-config.service';
import { ISiteConfig } from '../../core/models/site-config.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private _productService: ProductService,
    private _testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
    private _siteConfigService: SiteConfigService,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _zone: NgZone,
  ) {}

  siteConfig: ISiteConfig | null = null;
  isLoggedIn = false;

  reviewRating = 0;
  hoveredStar = 0;
  reviewComment = '';
  isSubmitting = false;
  submitted = false;

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();

    this._siteConfigService.getSiteConfigData().subscribe((data) => {
      this.siteConfig = data;
      this._cdr.detectChanges();
    });
    this._productService.getBestSellerProducts(8).subscribe({
      next: (res) => {
        this.bestSellers = res.data;
        this._cdr.detectChanges();
      },
    });
    this._productService.getProducts({ sort: 'createdAtDESC', limit: 8 }).subscribe({
      next: (res) => {
        this.newArrivals = res.data.data;
        this._cdr.detectChanges();
      },
    });
    this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => {
        this.testimonials = res.data;
        this._cdr.detectChanges();
      },
    });
  }

  staticFilesURL = environment.staticFilesURL;

  newArrivals: IProduct[] = [];
  bestSellers: IProduct[] = [];
  testimonials: ITestimonial[] = [];

  setRating(rating: number) {
    this.reviewRating = rating;
  }

  submitTestimonial() {
    if (this.reviewRating === 0) {
      this._toastService.error('Please select a star rating');
      return;
    }
    if (!this.reviewComment.trim()) {
      this._toastService.error('Please write a comment');
      return;
    }
    this.isSubmitting = true;
    this._testimonialService
      .createTestimonial({
        rating: this.reviewRating,
        comment: this.reviewComment.trim(),
      })
      .subscribe({
        next: () => {
          this._zone.run(() => {
            this.submitted = true;
            this.isSubmitting = false;
          });
        },
        error: (err) => {
          this._toastService.error(err?.error?.message || 'Failed to submit review');
          this.isSubmitting = false;
          this._cdr.detectChanges();
        },
      });
  }

  getInitials(t: any): string {
    if (!t.user || typeof t.user === 'string' || !t.user.firstName) return 'C';
    const first = t.user.firstName.charAt(0).toUpperCase();
    const last = t.user.lastName ? t.user.lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  }

  getFullName(t: any): string {
    if (t.user && typeof t.user !== 'string' && t.user.firstName) {
      return `${t.user.firstName} ${t.user.lastName}`;
    }
    return 'Anonymous';
  }
}
