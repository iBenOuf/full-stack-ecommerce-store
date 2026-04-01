import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../../core/models/category.model';
import { ISubcategory } from '../../core/models/subcategory.model';
import { CategoryService } from '../../core/services/category.service';
import { SubcategoryService } from '../../core/services/subcategory.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-subcategories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-subcategories.html',
  styleUrl: './manage-subcategories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSubcategories implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  subcategories: ISubcategory[] = [];
  categories: ICategory[] = [];

  isLoading = true;
  isSaving = false;
  isDeleting = false;

  showModal = false;
  editingId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  subcatForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    slug: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  });

  constructor(
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._categoryService.getAdminCategories().subscribe({
      next: (catRes) => {
        this.categories = catRes.data;
        this._subcategoryService.getAdminSubcategories().subscribe({
          next: (subRes) => {
            this.subcategories = subRes.data;
            this.isLoading = false;
            this._cdr.detectChanges();
          },
          error: (err) => this.handleError('Failed to load subcategories'),
        });
      },
      error: (err) => this.handleError('Failed to load categories'),
    });
  }

  openAddModal() {
    this.editingId = null;
    this.subcatForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
  }

  openEditModal(subcat: ISubcategory) {
    this.editingId = subcat._id;
    const catId = typeof subcat.category === 'object' ? subcat.category._id : subcat.category;

    this.subcatForm.patchValue({
      name: subcat.name,
      slug: subcat.slug,
      category: catId,
    });
    this.selectedFile = null;
    this.previewUrl = subcat.image; // Cloudinary URL
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
  }

  closeModal() {
    this.showModal = false;
  }

  generateSlug() {
    const name = this.subcatForm.get('name')?.value;
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      this.subcatForm.patchValue({ slug });
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
    if (this.subcatForm.invalid) {
      this.subcatForm.markAllAsTouched();
      return;
    }
    if (!this.editingId && !this.selectedFile) {
      this._toastService.error('Image is required for new subcategories');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    formData.append('name', this.subcatForm.value.name!);
    formData.append('slug', this.subcatForm.value.slug!);
    formData.append('categoryId', this.subcatForm.value.category!);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const req$ = this.editingId
      ? this._subcategoryService.updateSubcategory(this.editingId, formData)
      : this._subcategoryService.createSubcategory(formData);

    const wasEditing = !!this.editingId;
    req$.subscribe({
      next: (res) => {
        setTimeout(() => {
          this.closeModal();
          this.isSaving = false;
          this.loadData();
          this._toastService.success(
            `Subcategory ${wasEditing ? 'updated' : 'created'} successfully`,
          );
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.isSaving = false;
          this._cdr.detectChanges();
          this._toastService.error(err?.error?.message || 'Failed to save subcategory');
        });
      },
    });
  }

  deleteSubcategory(id: string) {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.isDeleting = true;
      this._subcategoryService.deleteSubcategory(id).subscribe({
        next: () => {
          setTimeout(() => {
            this.isDeleting = false;
            this.loadData();
            this._toastService.success('Subcategory deleted successfully');
          });
        },
        error: (err) => {
          setTimeout(() => {
            this.isDeleting = false;
            this._cdr.detectChanges();
            this._toastService.error(err?.error?.message || 'Failed to delete subcategory');
          });
        },
      });
    }
  }

  getCategoryName(catRef: any): string {
    if (!catRef) return 'Unknown';
    if (typeof catRef === 'object' && catRef.name) return catRef.name;
    const found = this.categories.find((c) => c._id === catRef);
    return found ? found.name : 'Unknown';
  }

  private handleError(msg: string) {
    this.isLoading = false;
    this._cdr.detectChanges();
    setTimeout(() => this._toastService.error(msg));
  }
}
