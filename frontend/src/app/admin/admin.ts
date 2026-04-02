import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';
import { AuthService } from '../core/services/auth.service';
import { INotification, INotificationsResponse } from '../core/models/notification.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, OnDestroy {
  isSidebarCollapsed = true; // Start collapsed (hidden on mobile)
  isSidebarOpen = false;
  showNotifications = false;

  notifications: INotification[] = [];
  unreadCount = 0;

  private _notifSub!: Subscription;

  constructor(
    private _notificationService: NotificationService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadNotifications();

    const token = localStorage.getItem('token');
    if (token) {
      this._notificationService.connect(token);
    }

    this._notifSub = this._notificationService.newNotification$.subscribe(
      (notif: INotification | null) => {
        if (notif) {
          this.notifications.unshift(notif);
          this.unreadCount++;
          this._cdr.detectChanges();
        }
      },
    );
  }

  loadNotifications() {
    this._notificationService.getAllNotifications().subscribe((res: INotificationsResponse) => {
      this.notifications = res.data;
      this._cdr.detectChanges();
    });
    this._notificationService
      .getUnreadCount()
      .subscribe((res: { message: string; count: number }) => {
        this.unreadCount = res.count;
        this._cdr.detectChanges();
      });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isSidebarOpen = !this.isSidebarOpen;
    
    // On mobile, also prevent body scroll when sidebar is open
    if (window.innerWidth <= 768) {
      if (this.isSidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeSidebar() {
    this.isSidebarCollapsed = true;
    this.isSidebarOpen = false;
    document.body.style.overflow = '';
  }

  onNavClick() {
    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadCount > 0) {
      this._notificationService.markAllAsRead().subscribe(() => {
        this.unreadCount = 0;
        this.notifications.forEach((n) => (n.isRead = true));
        this._cdr.detectChanges();
      });
    }
  }

  ngOnDestroy() {
    if (this._notifSub) {
      this._notifSub.unsubscribe();
    }
    this._notificationService.disconnect();
  }
}
