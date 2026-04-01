import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ITokenData } from '../../../core/models/auth.model';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { ISubcategory } from '../../../core/models/subcategory.model';
import { CategoryService } from '../../../core/services/category.service';
import { ICategory } from '../../../core/models/category.model';
import { CartService } from '../../../core/services/cart.service';
import { SiteConfigService } from '../../../core/services/site-config.service';
import { ISiteConfig } from '../../../core/models/site-config.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  constructor(
    private _authService: AuthService,
    private _subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
    private _categoryService: CategoryService,
    private _cartService: CartService,
    private _siteConfigService: SiteConfigService,
  ) {}

  cartCount = 0;
  userData: ITokenData | null = null;
  subcategories: ISubcategory[] = [];
  categories: ICategory[] = [];
  siteConfig: ISiteConfig | null = null;
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((data) => {
      setTimeout(() => {
        this.siteConfig = data;
        this._cdr.detectChanges();
      });
    });
    this._cartService.cartCount.subscribe((count) => {
      setTimeout(() => {
        this.cartCount = count;
        this._cdr.detectChanges();
      });
    });
    this._authService.getAuthData().subscribe((data) => {
      this.userData = data;
    });
    this._subcategoryService.getAllSubcategories().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.subcategories = res.data;
          this._cdr.detectChanges();
        });
      },
    });
    this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.categories = res.data;
          this._cdr.detectChanges();
        });
      },
    });
  }
}
