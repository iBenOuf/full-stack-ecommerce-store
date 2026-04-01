import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ICategory } from '../../../core/models/category.model';
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
    private _categoryService: CategoryService,
    private _siteConfigService: SiteConfigService,
  ) {}

  categories: ICategory[] = [];
  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((config) => {
      setTimeout(() => {
        this.siteConfig = config;
        this._cdr.detectChanges();
      });
    });
    this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this._cdr.detectChanges();
      },
    });
  }

  email = '';
  currentYear = new Date().getFullYear();
}
