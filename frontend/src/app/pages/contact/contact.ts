import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ISiteConfig } from '../../core/models/site-config.model';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
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

  getSocialIcon(name: string): string {
    const icons: Record<string, string> = {
      facebook: 'f',
      instagram: '◉',
      twitter: '✕',
      tiktok: '♪',
      youtube: '▶',
      pinterest: '⊕',
    };
    return icons[name.toLowerCase()] ?? '↗';
  }
}
