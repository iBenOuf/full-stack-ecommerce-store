import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ISiteConfig } from '../../core/models/site-config.model';
import { SiteConfigService } from '../../core/services/site-config.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './site-settings.html',
  styleUrl: './site-settings.css',
})
export class SiteSettings implements OnInit, OnDestroy {
  activeTab: 'general' | 'hero' | 'about' | 'footer' = 'general';
  isLoading = true;
  isSaving = false;
  private _sub!: Subscription;

  configForm = new FormGroup({
    siteName: new FormControl('', Validators.required),
    announcement: new FormControl(''),
    heroSection: new FormGroup({
      heroSlogan: new FormControl(''),
      heroTitle: new FormGroup({
        line1: new FormControl(''),
        line2: new FormControl(''),
        line3: new FormControl(''),
      }),
      heroDescription: new FormControl(''),
      season: new FormControl(''),
      heroImage: new FormControl(''),
    }),
    aboutSection: new FormGroup({
      aboutSlogan: new FormControl(''),
      aboutTitle: new FormGroup({
        line1: new FormControl(''),
        line2: new FormControl(''),
        line3: new FormControl(''),
      }),
      aboutDescription: new FormControl(''),
      analytics: new FormGroup({
        stat1: new FormGroup({ value: new FormControl(''), label: new FormControl('') }),
        stat2: new FormGroup({ value: new FormControl(''), label: new FormControl('') }),
        stat3: new FormGroup({ value: new FormControl(''), label: new FormControl('') }),
        stat4: new FormGroup({ value: new FormControl(''), label: new FormControl('') }),
      }),
    }),
    footerSection: new FormGroup({
      footerText: new FormControl(''),
      contactEmail: new FormControl('', Validators.email),
      contactPhone: new FormControl(''),
      copyrightText: new FormControl(''),
    }),
    facebook: new FormControl(''),
    instagram: new FormControl(''),
    twitter: new FormControl(''),
    youtube: new FormControl(''),
    tiktok: new FormControl(''),
    pinterest: new FormControl(''),
  });

  constructor(
    private _siteConfigService: SiteConfigService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._sub = this._siteConfigService.getSiteConfigData().subscribe((config) => {
      if (config) {
        this.patchForm(config);
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
    if (!this._siteConfigService.getConfigSnapshot()) {
      this._siteConfigService.fetchConfig();
    } else {
      this.isLoading = false;
    }
  }

  private getSocialUrl(config: ISiteConfig, name: string): string {
    if (!config.footerSection?.socialLinks) return '';
    const link = config.footerSection.socialLinks.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    return link ? link.url : '';
  }

  private patchForm(config: ISiteConfig) {
    this.configForm.patchValue({
      siteName: config.siteName,
      announcement: config.announcement,
      heroSection: {
        heroSlogan: config.heroSection?.heroSlogan,
        heroTitle: {
          line1: config.heroSection?.heroTitle?.line1,
          line2: config.heroSection?.heroTitle?.line2,
          line3: config.heroSection?.heroTitle?.line3,
        },
        heroDescription: config.heroSection?.heroDescription,
        season: config.heroSection?.season,
        heroImage: config.heroSection?.heroImage,
      },
      aboutSection: {
        aboutSlogan: config.aboutSection?.aboutSlogan,
        aboutTitle: {
          line1: config.aboutSection?.aboutTitle?.line1,
          line2: config.aboutSection?.aboutTitle?.line2,
          line3: config.aboutSection?.aboutTitle?.line3,
        },
        aboutDescription: config.aboutSection?.aboutDescription,
        analytics: {
          stat1: {
            value: config.aboutSection?.analytics?.stat1?.value,
            label: config.aboutSection?.analytics?.stat1?.label,
          },
          stat2: {
            value: config.aboutSection?.analytics?.stat2?.value,
            label: config.aboutSection?.analytics?.stat2?.label,
          },
          stat3: {
            value: config.aboutSection?.analytics?.stat3?.value,
            label: config.aboutSection?.analytics?.stat3?.label,
          },
          stat4: {
            value: config.aboutSection?.analytics?.stat4?.value,
            label: config.aboutSection?.analytics?.stat4?.label,
          },
        },
      },
      footerSection: {
        footerText: config.footerSection?.footerText,
        contactEmail: config.footerSection?.contactEmail,
        contactPhone: config.footerSection?.contactPhone,
        copyrightText: config.footerSection?.copyrightText,
      },
      facebook: this.getSocialUrl(config, 'facebook'),
      instagram: this.getSocialUrl(config, 'instagram'),
      twitter: this.getSocialUrl(config, 'twitter'),
      youtube: this.getSocialUrl(config, 'youtube'),
      tiktok: this.getSocialUrl(config, 'tiktok'),
      pinterest: this.getSocialUrl(config, 'pinterest'),
    });
  }

  onSubmit() {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const val = this.configForm.value;
    const snapshot = this._siteConfigService.getConfigSnapshot();

    const socialNames = ['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'pinterest'];
    const socialLinks = socialNames
      .filter((name) => !!(val as any)[name])
      .map((name) => ({ name, url: (val as any)[name] as string }));

    const updateData = {
      siteName: val.siteName ?? '',
      announcement: val.announcement ?? '',
      heroSection: {
        heroSlogan: val.heroSection?.heroSlogan ?? '',
        heroTitle: {
          line1: val.heroSection?.heroTitle?.line1 ?? '',
          line2: val.heroSection?.heroTitle?.line2 ?? '',
          line3: val.heroSection?.heroTitle?.line3 ?? '',
        },
        heroDescription: val.heroSection?.heroDescription ?? '',
        season: val.heroSection?.season ?? '',
        heroImage: val.heroSection?.heroImage ?? '',
      },
      aboutSection: {
        aboutSlogan: val.aboutSection?.aboutSlogan ?? '',
        aboutTitle: {
          line1: val.aboutSection?.aboutTitle?.line1 ?? '',
          line2: val.aboutSection?.aboutTitle?.line2 ?? '',
          line3: val.aboutSection?.aboutTitle?.line3 ?? '',
        },
        aboutDescription: val.aboutSection?.aboutDescription ?? '',
        analytics: {
          stat1: {
            value: val.aboutSection?.analytics?.stat1?.value ?? '',
            label: val.aboutSection?.analytics?.stat1?.label ?? '',
          },
          stat2: {
            value: val.aboutSection?.analytics?.stat2?.value ?? '',
            label: val.aboutSection?.analytics?.stat2?.label ?? '',
          },
          stat3: {
            value: val.aboutSection?.analytics?.stat3?.value ?? '',
            label: val.aboutSection?.analytics?.stat3?.label ?? '',
          },
          stat4: {
            value: val.aboutSection?.analytics?.stat4?.value ?? '',
            label: val.aboutSection?.analytics?.stat4?.label ?? '',
          },
        },
      },
      footerSection: {
        footerText: val.footerSection?.footerText ?? '',
        socialLinks,
        contactEmail: val.footerSection?.contactEmail ?? '',
        contactPhone: val.footerSection?.contactPhone ?? '',
        copyrightText: val.footerSection?.copyrightText ?? '',
        paymentMethods: (snapshot?.footerSection?.paymentMethods ?? []).map(({ name }) => ({
          name,
        })),
      },
    };

    this._siteConfigService.updateConfig(updateData as any).subscribe({
      next: () => {
        this._toastService.success('Site settings saved successfully!');
        this.isSaving = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to save settings');
        this.isSaving = false;
        this._cdr.detectChanges();
      },
    });
  }

  ngOnDestroy() {
    if (this._sub) this._sub.unsubscribe();
  }
}
