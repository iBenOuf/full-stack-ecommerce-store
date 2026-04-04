import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '../../../core/services/site-config.service';
import { ISiteConfig } from '../../../core/models/site-config.model';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  constructor(
    private _cdr: ChangeDetectorRef,
    private _siteConfigService: SiteConfigService,
  ) {}

  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((config) => {
      setTimeout(() => {
        this.siteConfig = config;
        this._cdr.detectChanges();
      });
    });
  }

  email = '';
  currentYear = new Date().getFullYear();
}
