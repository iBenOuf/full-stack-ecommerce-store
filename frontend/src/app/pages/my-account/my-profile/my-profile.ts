import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { IPasswordRequest, IUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  user: IUser | null = null;
  isSaving = false;
  isChangingPassword = false;

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {
    this._authService.getAuthData().subscribe((data) => {
      if (data) {
        this._userService.getUser(data._id).subscribe({
          next: (res) => {
            this.user = res.data;
            this.patchForm();
            this._cdr.detectChanges();
          },
          error: () => this._toastService.error('Failed to load profile'),
        });
      }
    });
  }

  private patchForm(): void {
    if (!this.user) return;
    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phone: this.user.phone,
      gender: this.user.gender,
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this._userService.updateUser(this.user!._id, this.profileForm.value as IUser).subscribe({
      next: (res) => {
        this.user = res.data;
        this.patchForm();
        this.isSaving = false;
        this._toastService.success('Profile updated successfully');
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this._toastService.error(err?.error?.message || 'Failed to update profile');
        this._cdr.detectChanges();
      },
    });
  }

  onReset(): void {
    this.patchForm();
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isChangingPassword = true;
    this._userService
      .updatePassword(this.user!._id, this.passwordForm.value as IPasswordRequest)
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.isChangingPassword = false;
          this._toastService.success('Password updated successfully');
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.isChangingPassword = false;
          this._toastService.error(err?.error?.message || 'Failed to update password');
          this._cdr.detectChanges();
        },
      });
  }
}
