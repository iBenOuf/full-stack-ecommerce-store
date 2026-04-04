import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISiteConfig } from '../core/models/site-config.model';
import { SiteConfigService } from '../core/services/site-config.service';
import { I18nPipe } from '../core/pipes/i18n.pipe';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, I18nPipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound implements OnInit {
  constructor(
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef,
  ) {}

  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
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
}
