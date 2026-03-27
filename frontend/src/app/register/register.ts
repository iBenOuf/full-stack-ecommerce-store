import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { IRegisterRequest } from '../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  loading = false;
  error = '';

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    gender: new FormControl('female', Validators.required),
  });

  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this._authService.register(this.registerForm.value as IRegisterRequest).subscribe({
      next: () => {
        this.loading = false;
        this.registerForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message;
      },
    });
  }
}
