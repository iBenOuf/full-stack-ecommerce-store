import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ISiteConfig } from '../../core/models/site-config.model';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
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

  values = [
    { icon: '✦', title: 'Craftsmanship', desc: 'Every piece is crafted with care and precision, honoring traditional techniques while embracing modern aesthetics.' },
    { icon: '♻', title: 'Sustainability', desc: 'We are committed to sustainable practices — from responsible sourcing to eco-conscious packaging.' },
    { icon: '◈', title: 'Timelessness', desc: 'We design for longevity. Our collections transcend trends and are built to be worn for years to come.' },
    { icon: '◎', title: 'Inclusivity', desc: 'Fashion is for everyone. We celebrate diverse bodies, styles, and stories in everything we do.' },
  ];
}
