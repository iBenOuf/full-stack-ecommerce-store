import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCategories implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  categories: ICategory[] = [];
  isLoading = true;
  isSaving = false;
  isDeleting = false;

  showModal = false;
  editingId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    slug: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  constructor(
    private _categoryService: CategoryService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this._categoryService.getAdminCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this._cdr.detectChanges();
        setTimeout(() => this._toastService.error('Failed to load categories'));
      },
    });
  }

  openAddModal() {
    this.editingId = null;
    this.categoryForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
  }

  openEditModal(cat: ICategory) {
    this.editingId = cat._id;
    this.categoryForm.patchValue({ name: cat.name });
    this.categoryForm.patchValue({ slug: cat.slug });
    this.selectedFile = null;
    this.previewUrl = cat.imageUrl; // Cloudinary URL
    this.showModal = true;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
  }

  closeModal() {
    this.showModal = false;
  }

  generateSlug() {
    const name = this.categoryForm.get('name')?.value;
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      this.categoryForm.patchValue({ slug });
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
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    if (!this.editingId && !this.selectedFile) {
      this._toastService.error('Image is required for new categories');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name!);
    formData.append('slug', this.categoryForm.value.slug!);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const wasEditing = !!this.editingId;
    const req$ = this.editingId
      ? this._categoryService.updateCategory(this.editingId, formData)
      : this._categoryService.createCategory(formData);

    req$.subscribe({
      next: () => {
        setTimeout(() => {
          this.closeModal();
          this.isSaving = false;
          this.loadCategories();
          this._toastService.success(
            `Category ${wasEditing ? 'updated' : 'created'} successfully`,
          );
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.isSaving = false;
          this._cdr.detectChanges();
          this._toastService.error(err?.error?.message || 'Failed to save category');
        });
      },
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isDeleting = true;
      this._categoryService.deleteCategory(id).subscribe({
        next: () => {
          setTimeout(() => {
            this.isDeleting = false;
            this.loadCategories();
            this._toastService.success('Category deleted successfully');
          });
        },
        error: (err) => {
          setTimeout(() => {
            this.isDeleting = false;
            this._cdr.detectChanges();
            this._toastService.error(err?.error?.message || 'Failed to delete category');
          });
        },
      });
    }
  }
}
