import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FaqService } from '../../core/services/faq.service';
import { IFAQ } from '../../core/models/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements OnInit {
  constructor(
    private _faqService: FaqService,
    private _cdr: ChangeDetectorRef
  ) {}

  faqs: IFAQ[] = [];
  isLoading = true;
  activeId: string | null = null;

  ngOnInit(): void {
    this._faqService.getActiveFaqs().subscribe({
      next: (res) => {
        this.faqs = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  toggle(id: string) {
    this.activeId = this.activeId === id ? null : id;
  }
}
