import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SiteConfigService } from '../core/services/site-config.service';
import { ISiteConfig } from '../core/models/site-config.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef,
  ) {}

  siteConfig: ISiteConfig | null = null;

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((config) => {
      if (config) {
        this.siteConfig = config;
        this._cdr.detectChanges();
      }
    });
  }

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  loading = false;
  error = '';

  onSubmit() {
    if (this.signInForm.invalid) return;
    this.loading = true;
    this.error = '';
    this._authService.login(this.signInForm.value).subscribe({
      next: () => {
        this.loading = false;
        this._cdr.detectChanges();
        this._router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message;
        this._cdr.detectChanges();
      },
    });
  }
}
