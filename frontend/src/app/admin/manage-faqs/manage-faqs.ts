import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaqService } from '../../core/services/faq.service';
import { ToastService } from '../../core/services/toast.service';
import { IFAQ } from '../../core/models/faq.model';

@Component({
  selector: 'app-manage-faqs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manage-faqs.html',
  styleUrl: './manage-faqs.css',
})
export class ManageFaqs implements OnInit {
  constructor(
    private _faqService: FaqService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef
  ) {}

  faqs: IFAQ[] = [];
  isLoading = true;
  isSaving = false;
  
  showForm = false;
  editingId: string | null = null;

  faqForm = new FormGroup({
    question: new FormControl('', Validators.required),
    answer: new FormControl('', Validators.required),
    order: new FormControl(0, Validators.required),
    isActive: new FormControl(true)
  });

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs() {
    this.isLoading = true;
    this._faqService.getAllFaqs().subscribe({
      next: (res) => {
        this.faqs = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this._toastService.error('Failed to load FAQs');
        this._cdr.detectChanges();
      }
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.faqForm.reset({ order: 0, isActive: true });
    this.showForm = true;
  }

  openEditForm(faq: IFAQ) {
    this.editingId = faq._id;
    this.faqForm.patchValue({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive
    });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const reqData = {
      question: this.faqForm.value.question as string,
      answer: this.faqForm.value.answer as string,
      order: this.faqForm.value.order as number,
      isActive: this.faqForm.value.isActive as boolean,
    };

    const req$ = this.editingId 
      ? this._faqService.updateFaq(this.editingId, reqData)
      : this._faqService.createFaq(reqData);

    req$.subscribe({
      next: () => {
        this.isSaving = false;
        this._toastService.success(`FAQ ${this.editingId ? 'updated' : 'created'} successfully`);
        this.closeForm();
        this.loadFaqs();
      },
      error: (err) => {
        this.isSaving = false;
        this._toastService.error(err?.error?.message || 'Failed to save FAQ');
        this._cdr.detectChanges();
      }
    });
  }

  toggleActive(faq: IFAQ) {
    this._faqService.updateFaq(faq._id, { 
      question: faq.question, 
      answer: faq.answer, 
      isActive: !faq.isActive 
    }).subscribe({
      next: () => {
        this._toastService.success(`FAQ status updated`);
        this.loadFaqs();
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to update status');
      }
    });
  }

  deleteFaq(id: string) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this._faqService.deleteFaq(id).subscribe({
        next: () => {
          this._toastService.success('FAQ deleted');
          this.loadFaqs();
        },
        error: (err) => {
          this._toastService.error(err?.error?.message || 'Failed to delete FAQ');
        }
      });
    }
  }
}
