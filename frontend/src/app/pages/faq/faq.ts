import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaqService } from '../../core/services/faq.service';
import { SiteConfigService } from '../../core/services/site-config.service';
import { IFAQ } from '../../core/models/faq.model';
import { ISiteConfig } from '../../core/models/site-config.model';
import { I18nPipe } from '../../core/pipes/i18n.pipe';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, I18nPipe],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements OnInit {
  constructor(
    private _faqService: FaqService,
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef
  ) {}

  faqs: IFAQ[] = [];
  siteConfig: ISiteConfig | null = null;
  isLoading = true;
  activeId: string | null = null;

  ngOnInit(): void {
    this.loadSiteConfig();
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

  private loadSiteConfig(): void {
    const snapshot = this._siteConfigService.getConfigSnapshot();
    if (snapshot) {
      this.siteConfig = snapshot;
    } else {
      this._siteConfigService.getSiteConfigData().subscribe((config) => {
        if (config) {
          this.siteConfig = config;
          this._cdr.detectChanges();
        }
      });
      this._siteConfigService.fetchConfig();
    }
  }

  toggle(id: string) {
    this.activeId = this.activeId === id ? null : id;
  }
}
