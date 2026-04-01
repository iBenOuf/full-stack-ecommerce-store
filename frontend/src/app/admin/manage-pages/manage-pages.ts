import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPage } from '../../core/models/page.model';
import { PageService } from '../../core/services/page.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-manage-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-pages.html',
  styleUrl: './manage-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePages implements OnInit {
  pages: IPage[] = [];
  isLoading = true;
  isSaving = false;
  isProcessing = false;

  showModal = false;
  editingId: string | null = null;

  pageForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pageSlug: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    ]),
    content: new FormControl('', Validators.required),
  });

  constructor(
    private _pageService: PageService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadPages();

    this.pageForm.get('title')?.valueChanges.subscribe((val) => {
      if (!this.editingId && val) {
        const slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        this.pageForm.patchValue({ pageSlug: slug }, { emitEvent: false });
      }
    });
  }

  loadPages() {
    this.isLoading = true;
    this._pageService.getAllPages().subscribe({
      next: (res) => {
        this.pages = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => this.handleError('Failed to load pages'),
    });
  }

  openAddModal() {
    this.editingId = null;
    this.pageForm.reset();
    this.showModal = true;
  }

  generateSlug() {
    const title = this.pageForm.get('title')?.value;
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      this.pageForm.patchValue({ pageSlug: slug });
    }
  }

  openEditModal(page: IPage) {
    this.editingId = page._id;
    this.pageForm.patchValue({
      title: page.title,
      pageSlug: page.pageSlug,
      content: page.content,
    });
    this.pageForm.get('pageSlug')?.disable();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.pageForm.get('pageSlug')?.enable();
  }

  onSubmit() {
    if (this.pageForm.invalid) {
      this.pageForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.pageForm.getRawValue();

    const req$ = this.editingId
      ? this._pageService.updatePage(this.editingId, { title: val.title!, content: val.content! })
      : this._pageService.createPage({
          pageSlug: val.pageSlug!,
          title: val.title!,
          content: val.content!,
        });

    req$.subscribe({
      next: () => {
        setTimeout(() => {
          this._toastService.success(`Page ${this.editingId ? 'updated' : 'created'} successfully`);
          this.closeModal();
          this.loadPages();
          this.isSaving = false;
        });
      },
      error: (err) => {
        setTimeout(() => {
          this._toastService.error(err?.error?.message || 'Failed to save page');
          this.isSaving = false;
          this._cdr.detectChanges();
        });
      },
    });
  }

  toggleStatus(page: IPage) {
    this.isProcessing = true;
    const newStatus = !page.isActive;
    this._pageService.updatePage(page._id, { isActive: newStatus }).subscribe({
      next: () => {
        setTimeout(() => {
          this._toastService.success(`Page ${newStatus ? 'published' : 'unpublished'}`);
          this.loadPages();
          this.isProcessing = false;
        });
      },
      error: (err) => {
        setTimeout(() => {
          this._toastService.error(err?.error?.message || 'Failed to update status');
          this.isProcessing = false;
          this._cdr.detectChanges();
        });
      },
    });
  }

  deletePage(id: string) {
    if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      this.isProcessing = true;
      this._pageService.deletePage(id).subscribe({
        next: () => {
          setTimeout(() => {
            this._toastService.success('Page deleted successfully');
            this.loadPages();
            this.isProcessing = false;
          });
        },
        error: () => {
          setTimeout(() => {
            this._toastService.error('Failed to delete page');
            this.isProcessing = false;
            this._cdr.detectChanges();
          });
        },
      });
    }
  }

  private handleError(msg: string) {
    setTimeout(() => {
      this._toastService.error(msg);
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }
}
