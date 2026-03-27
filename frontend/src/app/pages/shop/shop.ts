import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ICategory } from '../../core/models/category.model';
import { cleanParams, IProduct, IProductsFilterParams } from '../../core/models/product.model';
import { ISubcategory } from '../../core/models/subcategory.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { SubcategoryService } from '../../core/services/subcategory.service';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  products: IProduct[] = [];
  categories: ICategory[] = [];
  subcategories: ISubcategory[] = [];

  filterParams: IProductsFilterParams = { page: 1, limit: 12, sort: 'createdAtDESC' };

  totalProducts = 0;
  totalPages = 0;
  isLoading = false;
  activeCategoryId: string | null = null;

  skeletons = Array.from({ length: 12 }, (_, i) => i);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubcategories();

    this._route.queryParams.subscribe((params) => {
      this.filterParams = {
        page: +params['page'] || 1,
        limit: 12,
        sort: params['sort'] || 'createdAtDESC',
        filter: params['filter'] || undefined,
        subcategorySlug: params['subcategorySlug'] || undefined,
        categorySlug: params['categorySlug'] || undefined,
        inStock: params['inStock'] === 'true' || undefined,
      };
      this.loadProducts();
    });

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.filterParams.filter = term || undefined;
      this.filterParams.page = 1;
      this.updateUrl();
    });
  }

  private loadProducts(): void {
    this.isLoading = true;
    this._productService.getProducts(this.filterParams).subscribe({
      next: (res) => {
        this.products = res.data.data ?? [];
        this.totalProducts = res.data.total ?? 0;
        this.totalPages = res.data.totalPages ?? 0;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  private loadCategories(): void {
    this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this._cdr.detectChanges();
      },
      error: () => {},
    });
  }

  private loadSubcategories(): void {
    this._subcategoryService.getAllSubcategories().subscribe({
      next: (res) => {
        this.subcategories = res.data;
        this._cdr.detectChanges();
      },
      error: () => {},
    });
  }

  getSubcategories(categoryId: string): ISubcategory[] {
    return this.subcategories.filter((subcategory) =>
      typeof subcategory.category === 'string'
        ? subcategory.category === categoryId
        : subcategory.category._id === categoryId,
    );
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  onSort(event: Event): void {
    this.filterParams.sort = (event.target as HTMLSelectElement).value;
    this.filterParams.page = 1;
    this.updateUrl();
  }

  toggleCategory(categoryId: string): void {
    if (this.activeCategoryId === categoryId) {
      this.activeCategoryId = null;
    } else {
      this.activeCategoryId = categoryId;
    }
  }

  setSubcategory(subcategorySlug: string): void {
    this.filterParams.subcategorySlug = subcategorySlug;
    this.filterParams.categorySlug = undefined;
    this.filterParams.page = 1;
    this.updateUrl();
  }

  clearCategoryFilter(): void {
    this.activeCategoryId = null;
    this.filterParams.subcategorySlug = undefined;
    this.filterParams.categorySlug = undefined;
    this.filterParams.page = 1;
    this.updateUrl();
  }

  toggleInStock(): void {
    this.filterParams.inStock = this.filterParams.inStock ? undefined : true;
    this.filterParams.page = 1;
    this.updateUrl();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filterParams.filter ||
      this.filterParams.subcategorySlug ||
      this.filterParams.categorySlug ||
      this.filterParams.inStock
    );
  }

  clearAllFilters(): void {
    this.activeCategoryId = null;
    this.filterParams = { page: 1, limit: 12, sort: this.filterParams.sort };
    this.updateUrl();
  }

  goToPage(page: number): void {
    this.filterParams.page = page;
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.filterParams.page!;
    const pages: number[] = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);
    if (current > 3) pages.push(-1);

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push(-1);
    pages.push(total);

    return pages;
  }

  private updateUrl(): void {
    const queryParams: cleanParams = {};
    if (this.filterParams.page && this.filterParams.page > 1)
      queryParams['page'] = this.filterParams.page.toString();
    if (this.filterParams.sort && this.filterParams.sort !== 'createdAtDESC')
      queryParams['sort'] = this.filterParams.sort;
    if (this.filterParams.filter) queryParams['filter'] = this.filterParams.filter;
    if (this.filterParams.subcategorySlug)
      queryParams['subcategorySlug'] = this.filterParams.subcategorySlug;
    if (this.filterParams.categorySlug)
      queryParams['categorySlug'] = this.filterParams.categorySlug;
    if (this.filterParams.inStock) queryParams['inStock'] = 'true';

    this._router.navigate([], { queryParams, replaceUrl: true });
  }
}
