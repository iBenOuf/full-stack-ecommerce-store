import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { IProduct } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { ISiteConfig } from '../../core/models/site-config.model';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductCard, I18nPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _toastService: ToastService,
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef,
  ) {}

  product: IProduct | null = null;
  relatedProducts: IProduct[] = [];
  quantity = 1;
  openAccordion: string | null = 'details';
  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
    this.loadSiteConfig();
    this._route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.loadProduct(slug);
    });
  }

  private loadSiteConfig(): void {
    const snapshot = this._siteConfigService.getConfigSnapshot();
    if (snapshot) {
      this.siteConfig = snapshot;
    } else {
      this._siteConfigService.getSiteConfigData().subscribe((config) => {
        if (config) {
          this.siteConfig = config;
          this._cdr.detectChanges();
        }
      });
      this._siteConfigService.fetchConfig();
    }
  }

  private loadProduct(slug: string): void {
    this.product = null;
    this.relatedProducts = [];
    this.quantity = 1;

    this._productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        this.product = res.data;
        this._cdr.detectChanges();
        this.loadRelated();
      },
      error: () => {
        this._toastService.error('Product not found.');
      },
    });
  }
  private loadRelated(): void {
    if (!this.product || !this.product.subcategory) return;
    this._productService
      .getRelatedProducts(this.product._id, this.product.subcategory._id)
      .subscribe({
        next: (res) => {
          this.relatedProducts = res.data;
          this._cdr.detectChanges();
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  toggleAccordion(key: string): void {
    this.openAccordion = this.openAccordion === key ? null : key;
  }
  addToCart(): void {
    if (!this.product) return;
    this._cartService.addToLocalCart(this.product, this.quantity);
  }
}
