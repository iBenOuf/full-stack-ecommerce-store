import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteSettings implements OnInit, OnDestroy {
  activeTab: 'general' | 'hero' | 'about' | 'footer' | 'content' | 'pages' = 'general';
  isLoading = true;
  isSaving = false;
  isUploading = false;
  uploadProgress = 0;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
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
    socialLinks: new FormArray([] as any),
    paymentMethods: new FormArray([] as any),
    coreValues: new FormArray([] as any),
    shippingPolicy: new FormGroup({
      title: new FormGroup({ en: new FormControl('') }),
      freeShipping: new FormGroup({ en: new FormControl('') }),
      standardDelivery: new FormGroup({ en: new FormControl('') }),
      returnsPolicy: new FormGroup({ en: new FormControl('') }),
      returnsDays: new FormControl(14),
    }),
    footerLinks: new FormArray([] as any),
    shopPage: new FormGroup({
      heading: new FormGroup({ en: new FormControl('') }),
      subtitle: new FormGroup({ en: new FormControl('') }),
    }),
    contactPage: new FormGroup({
      eyebrow: new FormGroup({ en: new FormControl('') }),
      heading: new FormGroup({ en: new FormControl('') }),
      subtitle: new FormGroup({ en: new FormControl('') }),
      emailHeading: new FormGroup({ en: new FormControl('') }),
      emailDesc: new FormGroup({ en: new FormControl('') }),
      phoneHeading: new FormGroup({ en: new FormControl('') }),
      phoneDesc: new FormGroup({ en: new FormControl('') }),
      visitHeading: new FormGroup({ en: new FormControl('') }),
      visitDesc: new FormGroup({ en: new FormControl('') }),
      socialEyebrow: new FormGroup({ en: new FormControl('') }),
      socialHeading: new FormGroup({ en: new FormControl('') }),
      faqText: new FormGroup({ en: new FormControl('') }),
      faqLinkText: new FormGroup({ en: new FormControl('') }),
    }),
    faqPage: new FormGroup({
      heading: new FormGroup({ en: new FormControl('') }),
      subtitle: new FormGroup({ en: new FormControl('') }),
      footerText: new FormGroup({ en: new FormControl('') }),
      footerButtonText: new FormGroup({ en: new FormControl('') }),
    }),
    notFoundPage: new FormGroup({
      eyebrow: new FormGroup({ en: new FormControl('') }),
      heading: new FormGroup({ en: new FormControl('') }),
      subtitle: new FormGroup({ en: new FormControl('') }),
      suggestionsHeading: new FormGroup({ en: new FormControl('') }),
      suggestions: new FormArray([] as any),
    }),
    navLinks: new FormArray([] as any),
  });

  constructor(
    private _fb: FormBuilder,
    private _siteConfigService: SiteConfigService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  get coreValues(): FormArray {
    return this.configForm.get('coreValues') as FormArray;
  }

  get socialLinks(): FormArray {
    return this.configForm.get('socialLinks') as FormArray;
  }

  get paymentMethods(): FormArray {
    return this.configForm.get('paymentMethods') as FormArray;
  }

  get navLinks(): FormArray {
    return this.configForm.get('navLinks') as FormArray;
  }

  get footerLinks(): FormArray {
    return this.configForm.get('footerLinks') as FormArray;
  }

  get notFoundSuggestions(): FormArray {
    return this.configForm.get('notFoundPage.suggestions') as FormArray;
  }

  addCoreValue() {
    this.coreValues.push(this._fb.group({
      icon: new FormControl(''),
      title: this._fb.group({ en: new FormControl('') }),
      description: this._fb.group({ en: new FormControl('') }),
    }));
  }

  removeCoreValue(index: number) {
    this.coreValues.removeAt(index);
  }

  addSocialLink() {
    this.socialLinks.push(this._fb.group({
      name: new FormControl(''),
      url: new FormControl(''),
    }));
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  addPaymentMethod() {
    this.paymentMethods.push(this._fb.group({
      name: new FormControl(''),
    }));
  }

  removePaymentMethod(index: number) {
    this.paymentMethods.removeAt(index);
  }

  addNavLink() {
    this.navLinks.push(this._fb.group({
      label: this._fb.group({ en: new FormControl('') }),
      url: new FormControl(''),
      queryParams: new FormControl(''),
    }));
  }

  removeNavLink(index: number) {
    this.navLinks.removeAt(index);
  }

  addFooterLinkSection() {
    this.footerLinks.push(this._fb.group({
      section: this._fb.group({ en: new FormControl('') }),
      links: this._fb.array([]),
    }));
  }

  removeFooterLinkSection(index: number) {
    this.footerLinks.removeAt(index);
  }

  getSectionLinks(sectionIndex: number): FormArray {
    return this.footerLinks.at(sectionIndex).get('links') as FormArray;
  }

  addSectionLink(sectionIndex: number) {
    const links = this.getSectionLinks(sectionIndex);
    links.push(this._fb.group({
      label: this._fb.group({ en: new FormControl('') }),
      url: new FormControl(''),
    }));
  }

  removeSectionLink(sectionIndex: number, linkIndex: number) {
    this.getSectionLinks(sectionIndex).removeAt(linkIndex);
  }

  addNotFoundSuggestion() {
    this.notFoundSuggestions.push(this._fb.group({
      label: this._fb.group({ en: new FormControl('') }),
      url: new FormControl(''),
    }));
  }

  removeNotFoundSuggestion(index: number) {
    this.notFoundSuggestions.removeAt(index);
  }

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

  private patchForm(config: ISiteConfig) {
    this.coreValues.clear();
    (config.coreValues || []).forEach((v) => {
      this.coreValues.push(this._fb.group({
        icon: new FormControl(v.icon || ''),
        title: this._fb.group({ en: new FormControl(v.title?.en || '') }),
        description: this._fb.group({ en: new FormControl(v.description?.en || '') }),
      }));
    });

    this.socialLinks.clear();
    (config.footerSection?.socialLinks || []).forEach((link) => {
      this.socialLinks.push(this._fb.group({
        name: new FormControl(link.name || ''),
        url: new FormControl(link.url || ''),
      }));
    });

    this.paymentMethods.clear();
    (config.footerSection?.paymentMethods || []).forEach((pm) => {
      this.paymentMethods.push(this._fb.group({
        name: new FormControl(pm.name || ''),
      }));
    });

    this.navLinks.clear();
    (config.navLinks || []).forEach((link) => {
      this.navLinks.push(this._fb.group({
        label: this._fb.group({ en: new FormControl(link.label?.en || '') }),
        url: new FormControl(link.url || ''),
        queryParams: new FormControl(link.queryParams ? JSON.stringify(link.queryParams) : ''),
      }));
    });

    this.footerLinks.clear();
    (config.footerLinks || []).forEach((section) => {
      const linksArray = this._fb.array(
        (section.links || []).map((l) =>
          this._fb.group({
            label: this._fb.group({ en: new FormControl(l.label?.en || '') }),
            url: new FormControl(l.url || ''),
          })
        ),
      );
      this.footerLinks.push(this._fb.group({
        section: this._fb.group({ en: new FormControl(section.section?.en || '') }),
        links: linksArray,
      }));
    });

    this.notFoundSuggestions.clear();
    (config.notFoundPage?.suggestions || []).forEach((s) => {
      this.notFoundSuggestions.push(this._fb.group({
        label: this._fb.group({ en: new FormControl(s.label?.en || '') }),
        url: new FormControl(s.url || ''),
      }));
    });

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
      shippingPolicy: {
        title: { en: config.shippingPolicy?.title?.en || '' },
        freeShipping: { en: config.shippingPolicy?.freeShipping?.en || '' },
        standardDelivery: { en: config.shippingPolicy?.standardDelivery?.en || '' },
        returnsPolicy: { en: config.shippingPolicy?.returnsPolicy?.en || '' },
        returnsDays: config.shippingPolicy?.returnsDays || 14,
      },
      shopPage: {
        heading: { en: config.shopPage?.heading?.en || '' },
        subtitle: { en: config.shopPage?.subtitle?.en || '' },
      },
      contactPage: {
        eyebrow: { en: config.contactPage?.eyebrow?.en || '' },
        heading: { en: config.contactPage?.heading?.en || '' },
        subtitle: { en: config.contactPage?.subtitle?.en || '' },
        emailHeading: { en: config.contactPage?.emailHeading?.en || '' },
        emailDesc: { en: config.contactPage?.emailDesc?.en || '' },
        phoneHeading: { en: config.contactPage?.phoneHeading?.en || '' },
        phoneDesc: { en: config.contactPage?.phoneDesc?.en || '' },
        visitHeading: { en: config.contactPage?.visitHeading?.en || '' },
        visitDesc: { en: config.contactPage?.visitDesc?.en || '' },
        socialEyebrow: { en: config.contactPage?.socialEyebrow?.en || '' },
        socialHeading: { en: config.contactPage?.socialHeading?.en || '' },
        faqText: { en: config.contactPage?.faqText?.en || '' },
        faqLinkText: { en: config.contactPage?.faqLinkText?.en || '' },
      },
      faqPage: {
        heading: { en: config.faqPage?.heading?.en || '' },
        subtitle: { en: config.faqPage?.subtitle?.en || '' },
        footerText: { en: config.faqPage?.footerText?.en || '' },
        footerButtonText: { en: config.faqPage?.footerButtonText?.en || '' },
      },
      notFoundPage: {
        eyebrow: { en: config.notFoundPage?.eyebrow?.en || '' },
        heading: { en: config.notFoundPage?.heading?.en || '' },
        subtitle: { en: config.notFoundPage?.subtitle?.en || '' },
        suggestionsHeading: { en: config.notFoundPage?.suggestionsHeading?.en || '' },
      },
    });

    if (config.heroSection?.heroImage) {
      this.previewUrl = config.heroSection.heroImage;
    }
  }

  onSubmit() {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const val = this.configForm.value;
    const snapshot = this._siteConfigService.getConfigSnapshot();

    const socialLinks = (val.socialLinks || [])
      .filter((s: any) => s.url)
      .map((s: any) => ({ name: s.name, url: s.url }));

    const coreValues = (val.coreValues || []).map((v: any) => ({
      icon: v.icon || '',
      title: { en: v.title?.en || '' },
      description: { en: v.description?.en || '' },
    }));

    const footerLinks = (val.footerLinks || []).map((section: any) => ({
      section: { en: section.section?.en || '' },
      links: (section.links || []).map((l: any) => ({
        label: { en: l.label?.en || '' },
        url: l.url || '',
      })),
    }));

    const paymentMethods = (val.paymentMethods || [])
      .filter((pm: any) => pm.name)
      .map((pm: any) => ({ name: pm.name }));

    const navLinks = (val.navLinks || [])
      .filter((l: any) => l.label?.en && l.url)
      .map((l: any) => {
        let qp: Record<string, any> | undefined;
        if (l.queryParams && l.queryParams.trim()) {
          try { qp = JSON.parse(l.queryParams); } catch {}
        }
        return {
          label: { en: l.label?.en || '' },
          url: l.url || '',
          queryParams: qp || undefined,
        };
      });

    const notFoundSuggestions = (val.notFoundPage?.suggestions || []).map((s: any) => ({
      label: { en: s.label?.en || '' },
      url: s.url || '',
    }));

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
        paymentMethods,
      },
      coreValues,
      shippingPolicy: {
        title: { en: val.shippingPolicy?.title?.en ?? '' },
        freeShipping: { en: val.shippingPolicy?.freeShipping?.en ?? '' },
        standardDelivery: { en: val.shippingPolicy?.standardDelivery?.en ?? '' },
        returnsPolicy: { en: val.shippingPolicy?.returnsPolicy?.en ?? '' },
        returnsDays: val.shippingPolicy?.returnsDays ?? 14,
      },
      footerLinks,
      shopPage: {
        heading: { en: val.shopPage?.heading?.en ?? '' },
        subtitle: { en: val.shopPage?.subtitle?.en ?? '' },
      },
      contactPage: {
        eyebrow: { en: val.contactPage?.eyebrow?.en ?? '' },
        heading: { en: val.contactPage?.heading?.en ?? '' },
        subtitle: { en: val.contactPage?.subtitle?.en ?? '' },
        emailHeading: { en: val.contactPage?.emailHeading?.en ?? '' },
        emailDesc: { en: val.contactPage?.emailDesc?.en ?? '' },
        phoneHeading: { en: val.contactPage?.phoneHeading?.en ?? '' },
        phoneDesc: { en: val.contactPage?.phoneDesc?.en ?? '' },
        visitHeading: { en: val.contactPage?.visitHeading?.en ?? '' },
        visitDesc: { en: val.contactPage?.visitDesc?.en ?? '' },
        socialEyebrow: { en: val.contactPage?.socialEyebrow?.en ?? '' },
        socialHeading: { en: val.contactPage?.socialHeading?.en ?? '' },
        faqText: { en: val.contactPage?.faqText?.en ?? '' },
        faqLinkText: { en: val.contactPage?.faqLinkText?.en ?? '' },
      },
      faqPage: {
        heading: { en: val.faqPage?.heading?.en ?? '' },
        subtitle: { en: val.faqPage?.subtitle?.en ?? '' },
        footerText: { en: val.faqPage?.footerText?.en ?? '' },
        footerButtonText: { en: val.faqPage?.footerButtonText?.en ?? '' },
      },
      notFoundPage: {
        eyebrow: { en: val.notFoundPage?.eyebrow?.en ?? '' },
        heading: { en: val.notFoundPage?.heading?.en ?? '' },
        subtitle: { en: val.notFoundPage?.subtitle?.en ?? '' },
        suggestionsHeading: { en: val.notFoundPage?.suggestionsHeading?.en ?? '' },
        suggestions: notFoundSuggestions,
      },
      navLinks,
    };

    this._siteConfigService.updateConfig(updateData as any).subscribe({
      next: () => {
        setTimeout(() => {
          this._toastService.success('Site settings saved successfully!');
          this.isSaving = false;
          this._cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          this._toastService.error(err?.error?.message || 'Failed to save settings');
          this.isSaving = false;
          this._cdr.detectChanges();
        });
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      this._toastService.error('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this._toastService.error('Image size must be less than 5MB');
      return;
    }

    this.selectedFile = file;
    
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = URL.createObjectURL(file);
  }

  onUpload() {
    if (!this.selectedFile) {
      this._toastService.error('Please select a file first');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this._siteConfigService.uploadHeroImage(this.selectedFile).subscribe({
      next: (res) => {
        setTimeout(() => {
          const cloudinaryUrl = res.data.heroSection.heroImage;
          this.configForm.patchValue({
            heroSection: { heroImage: cloudinaryUrl }
          });
          this.previewUrl = cloudinaryUrl;
          this._toastService.success('Hero image uploaded successfully!');
          this.selectedFile = null;
          this.isUploading = false;
          this._cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          this._toastService.error(err?.error?.message || 'Failed to upload image');
          this.isUploading = false;
          this._cdr.detectChanges();
        });
      },
    });
  }

  ngOnDestroy() {
    if (this._sub) this._sub.unsubscribe();
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
