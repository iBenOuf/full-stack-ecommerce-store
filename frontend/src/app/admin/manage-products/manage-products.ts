import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../../core/models/category.model';
import { IProduct } from '../../core/models/product.model';
import { ISubcategory } from '../../core/models/subcategory.model';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { SubcategoryService } from '../../core/services/subcategory.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
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

  currentPage = 1;
  totalPages = 1;

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
    });
    this._subcategoryService.getAdminSubcategories().subscribe((res) => {
      this.subcategories = res.data;
    });
  }

  loadProducts() {
    this.isLoading = true;
    this._productService.getAdminProducts(this.currentPage, 12).subscribe({
      next: (res) => {
        this.products = res.data.data;
        this.totalPages = res.data.totalPages || 1;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => this.handleError('Failed to load products'),
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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
    this.previewUrl = prod.imageUrl; // Cloudinary URL
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
  }

  closeModal() {
    this.showModal = false;
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
        this._toastService.success(
          `Product ${this.editingId ? 'updated' : 'created'} successfully`,
        );
        this.closeModal();
        this.loadProducts();
        this.isSaving = false;
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to save product');
        this.isSaving = false;
        this._cdr.detectChanges();
      },
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isDeleting = true;
      this._productService.deleteProduct(id).subscribe({
        next: () => {
          this._toastService.success('Product deleted successfully');
          this.loadProducts();
          this.isDeleting = false;
        },
        error: (err) => {
          this._toastService.error(err?.error?.message || 'Failed to delete product');
          this.isDeleting = false;
          this._cdr.detectChanges();
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
    this._toastService.error(msg);
    this.isLoading = false;
    this._cdr.detectChanges();
  }
}
