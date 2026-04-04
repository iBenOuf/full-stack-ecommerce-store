import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ISiteConfig } from '../../core/models/site-config.model';
import { SiteConfigService } from '../../core/services/site-config.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink, I18nPipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  constructor(
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef,
  ) {}

  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((data) => {
      this.siteConfig = data;
      this._cdr.detectChanges();
    });
  }
}
