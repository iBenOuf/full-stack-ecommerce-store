import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ICategory } from '../../core/models/category.model';
import { IProduct, IProductsFilterParams } from '../../core/models/product.model';
import { ISubcategory } from '../../core/models/subcategory.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { SubcategoryService } from '../../core/services/subcategory.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageProducts implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  products: IProduct[] = [];
  categories: ICategory[] = [];
  subcategories: ISubcategory[] = [];
  filteredSubcategories: ISubcategory[] = [];

  isLoading = true;
  isSaving = false;
  isDeleting = false;

  totalProducts = 0;
  totalPages = 1;
  currentPage = 1;

  filterParams: IProductsFilterParams = {
    page: 1,
    limit: 12,
    sort: 'createdAtDESC',
    status: 'all',
    stockStatus: undefined,
  };

  activeCategoryId: string | null = null;
  private searchSubject = new Subject<string>();

  showModal = false;
  editingId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    slug: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stockQuantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
  });

  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadDependencies();
    this.loadProducts();

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.filterParams.filter = term || undefined;
      this.filterParams.page = 1;
      this.currentPage = 1;
      this.loadProducts();
    });

    this.productForm.get('category')?.valueChanges.subscribe((catId) => {
      if (catId) {
        this.filteredSubcategories = this.subcategories.filter((sub) => {
          const subCatId = typeof sub.category === 'object' ? sub.category._id : sub.category;
          return subCatId === catId;
        });

        const currentSubId = this.productForm.get('subcategory')?.value;
        if (currentSubId && !this.filteredSubcategories.some((s) => s._id === currentSubId)) {
          this.productForm.patchValue({ subcategory: '' }, { emitEvent: false });
        }
      } else {
        this.filteredSubcategories = [];
      }
      this._cdr.detectChanges();
    });
  }

  loadDependencies() {
    this._categoryService.getAdminCategories().subscribe((res) => {
      this.categories = res.data;
      this._cdr.detectChanges();
    });
    this._subcategoryService.getAdminSubcategories().subscribe((res) => {
      this.subcategories = res.data;
      this._cdr.detectChanges();
    });
  }

  loadProducts() {
    this.isLoading = true;
    const params: IProductsFilterParams = {
      ...this.filterParams,
      page: this.currentPage,
    };
    this._productService.getAdminProducts(params).subscribe({
      next: (res) => {
        this.products = res.data.data;
        this.totalProducts = res.data.total;
        this.totalPages = res.data.totalPages || 1;
        this.currentPage = res.data.page || 1;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => this.handleError('Failed to load products'),
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  onSort(event: Event) {
    this.filterParams.sort = (event.target as HTMLSelectElement).value;
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleCategory(catId: string) {
    if (this.activeCategoryId === catId) {
      this.activeCategoryId = null;
      this.filterParams.categorySlug = undefined;
      this.filterParams.subcategorySlug = undefined;
    } else {
      this.activeCategoryId = catId;
      const cat = this.categories.find((c) => c._id === catId);
      if (cat) {
        this.filterParams.categorySlug = cat.slug;
        this.filterParams.subcategorySlug = undefined;
      }
    }
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  setSubcategory(slug: string) {
    this.filterParams.subcategorySlug = slug;
    this.filterParams.categorySlug = undefined;
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  clearCategoryFilter() {
    this.activeCategoryId = null;
    this.filterParams.categorySlug = undefined;
    this.filterParams.subcategorySlug = undefined;
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  setStatus(status: string) {
    this.filterParams.status = status;
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  setStockStatus(stockStatus: string) {
    this.filterParams.stockStatus = this.filterParams.stockStatus === stockStatus ? undefined : stockStatus;
    this.filterParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filterParams.filter ||
      this.filterParams.categorySlug ||
      this.filterParams.subcategorySlug ||
      this.filterParams.status === 'deleted' ||
      this.filterParams.status === 'active' ||
      this.filterParams.status === 'enabled' ||
      this.filterParams.status === 'disabled' ||
      this.filterParams.stockStatus
    );
  }

  clearAllFilters() {
    this.filterParams = {
      page: 1,
      limit: 12,
      sort: this.filterParams.sort || 'createdAtDESC',
      status: 'all',
      stockStatus: undefined,
    };
    this.activeCategoryId = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  getSubcategories(catId: string): ISubcategory[] {
    return this.subcategories.filter((sub) => {
      const subCatId = typeof sub.category === 'object' ? sub.category._id : sub.category;
      return subCatId === catId;
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    if (this.totalPages <= maxVisible + 2) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (this.currentPage < this.totalPages - 2) pages.push(-1);
      pages.push(this.totalPages);
    }
    return pages;
  }

  toggleActive(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this._productService.updateProduct(id, { isActive: checked }).subscribe({
      next: () => {
        const prod = this.products.find((p) => p._id === id);
        if (prod) prod.isActive = checked;
        this._cdr.detectChanges();
        this._toastService.success(`Product ${checked ? 'activated' : 'deactivated'}`);
      },
      error: () => {
        this._toastService.error('Failed to update product');
        this.loadProducts();
      },
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterParams.page = page;
      this.loadProducts();
    }
  }

  openAddModal() {
    this.editingId = null;
    this.productForm.reset();
    this.filteredSubcategories = [];
    this.selectedFile = null;
    this.previewUrl = null;
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
    this._cdr.detectChanges();
  }

  openEditModal(prod: IProduct) {
    this.editingId = prod._id;

    const subCatId = typeof prod.subcategory === 'object' ? prod.subcategory._id : prod.subcategory;

    let catId = '';
    const foundSub = this.subcategories.find((s) => s._id === subCatId);
    if (foundSub) {
      catId = typeof foundSub.category === 'object' ? foundSub.category._id : foundSub.category;
    }

    this.productForm.patchValue({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      stockQuantity: prod.stockQuantity,
      category: catId,
      subcategory: subCatId as string,
    });

    this.selectedFile = null;
    this.previewUrl = prod.imageUrl;
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
    this._cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
  }

  generateSlug() {
    const name = this.productForm.get('name')?.value;
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      this.productForm.patchValue({ slug });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this._toastService.error('Image size must be less than 2MB');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if (!this.editingId && !this.selectedFile) {
      this._toastService.error('Image is required for new products');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    const val = this.productForm.value;

    formData.append('name', val.name!);
    formData.append('slug', val.slug!);
    formData.append('description', val.description!);
    formData.append('price', val.price!.toString());
    formData.append('stockQuantity', val.stockQuantity!.toString());
    formData.append('subcategoryId', val.subcategory!);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const req$ = this.editingId
      ? this._productService.updateProduct(this.editingId, formData)
      : this._productService.createProduct(formData);

    req$.subscribe({
      next: () => {
        setTimeout(() => {
          this._toastService.success(
            `Product ${this.editingId ? 'updated' : 'created'} successfully`,
          );
          this.closeModal();
          this.loadProducts();
          this.isSaving = false;
        });
      },
      error: (err) => {
        setTimeout(() => {
          this._toastService.error(err?.error?.message || 'Failed to save product');
          this.isSaving = false;
          this._cdr.detectChanges();
        });
      },
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isDeleting = true;
      this._productService.deleteProduct(id).subscribe({
        next: () => {
          setTimeout(() => {
            this._toastService.success('Product deleted successfully');
            this.loadProducts();
            this.isDeleting = false;
          });
        },
        error: (err) => {
          setTimeout(() => {
            this._toastService.error(err?.error?.message || 'Failed to delete product');
            this.isDeleting = false;
            this._cdr.detectChanges();
          });
        },
      });
    }
  }

  getSubCatName(subRef: any): string {
    if (!subRef) return 'Unknown';
    if (typeof subRef === 'object' && subRef.name) return subRef.name;
    const found = this.subcategories.find((s) => s._id === subRef);
    return found ? found.name : 'Unknown';
  }

  private handleError(msg: string) {
    setTimeout(() => {
      this._toastService.error(msg);
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
