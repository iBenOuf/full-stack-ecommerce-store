import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { IRegisterRequest } from '../core/models/auth.model';
import { SiteConfigService } from '../core/services/site-config.service';
import { ISiteConfig } from '../core/models/site-config.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  loading = false;
  error = '';
  siteConfig: ISiteConfig | null = null;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _siteConfigService: SiteConfigService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._siteConfigService.getSiteConfigData().subscribe((config) => {
      if (config) {
        this.siteConfig = config;
        this._cdr.detectChanges();
      }
    });
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    gender: new FormControl('female', Validators.required),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = this.registerForm.value;
    
    this._authService.register(registerData as IRegisterRequest).subscribe({
      next: () => {
        this.loading = false;
        this.registerForm.reset();
        this._router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      },
    });
  }
}
