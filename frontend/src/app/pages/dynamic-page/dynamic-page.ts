import { ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageService } from '../../core/services/page.service';
import { IPage } from '../../core/models/page.model';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.css',
})
export class DynamicPage implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _pageService: PageService,
    private _sanitizer: DomSanitizer,
    private _cdr: ChangeDetectorRef,
  ) {}

  page: IPage | null = null;
  safeContent: SafeHtml | null = null;
  isLoading = true;

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchPage(slug);
      } else {
        this._router.navigate(['/not-found']);
      }
    });
  }

  fetchPage(slug: string) {
    this.isLoading = true;
    this._pageService.getPageBySlug(slug).subscribe({
      next: (res) => {
        console.log('Dynamic page response:', res);
        if (res?.data) {
          this.page = res.data;
          this.safeContent = this._sanitizer.bypassSecurityTrustHtml(this.page.content);
        } else {
          this._router.navigate(['/not-found']);
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dynamic page error:', err);
        this._router.navigate(['/not-found']);
      },
    });
  }
}
