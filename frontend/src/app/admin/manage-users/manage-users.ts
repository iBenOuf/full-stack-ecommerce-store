import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IUser } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  users: IUser[] = [];
  isLoading = true;
  isProcessing = false;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this._userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data.users || res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => this.handleError('Failed to load users'),
    });
  }

  toggleStatus(user: IUser) {
    this.isProcessing = true;
    const newStatus = !user.isActive;
    this._userService.changeUserStatus(user._id, { status: newStatus }).subscribe({
      next: () => {
        this._toastService.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        this.loadUsers();
        this.isProcessing = false;
      },
      error: (err) => {
        this._toastService.error(err?.error?.message || 'Failed to update user status');
        this.isProcessing = false;
        this._cdr.detectChanges();
      },
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.isProcessing = true;
      this._userService.deleteUser(id).subscribe({
        next: () => {
          this._toastService.success('User deleted successfully');
          this.loadUsers();
          this.isProcessing = false;
        },
        error: () => {
          this._toastService.error('Failed to delete user');
          this.isProcessing = false;
          this._cdr.detectChanges();
        },
      });
    }
  }

  private handleError(msg: string) {
    this._toastService.error(msg);
    this.isLoading = false;
    this._cdr.detectChanges();
  }
}
