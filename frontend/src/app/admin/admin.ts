import { Component, ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NotificationService } from '../core/services/notification.service';
import { NotificationToastService } from '../core/services/notification-toast.service';
import { NotificationToast } from '../shared/components/notification-toast/notification-toast';
import { AuthService } from '../core/services/auth.service';
import { INotification, INotificationsResponse } from '../core/models/notification.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, NotificationToast],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, AfterViewInit, OnDestroy {
  isSidebarCollapsed = true;
  isSidebarOpen = false;
  showNotifications = false;

  notifications: INotification[] = [];
  unreadCount = 0;

  private _notifSub!: Subscription;
  private _routerSub!: Subscription;

  constructor(
    private _notificationService: NotificationService,
    private _notifToastService: NotificationToastService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _el: ElementRef,
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
          this._notifToastService.add({
            type: notif.type,
            title: notif.title,
            message: notif.message,
            createdAt: notif.createdAt,
          });
          this._cdr.detectChanges();
        }
      },
    );
  }

  ngAfterViewInit() {
    this._routerSub = this._router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const content = this._el.nativeElement.querySelector('.admin-content');
        if (content) content.scrollTop = 0;
      });
  }

  loadNotifications() {
    this._notificationService.getAllNotifications().subscribe((res: INotificationsResponse) => {
      this.notifications = res.data;
      this._cdr.detectChanges();
    });
    this._notificationService
      .getUnreadCount()
      .subscribe((res) => {
        this.unreadCount = res.data.count;
        this._cdr.detectChanges();
      });
  }

  markAsRead(id: string) {
    this._notificationService.markAsRead(id).subscribe(() => {
      const notif = this.notifications.find((n) => n._id === id);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this._cdr.detectChanges();
    });
  }

  markAllAsRead() {
    this._notificationService.markAllAsRead().subscribe(() => {
      this.unreadCount = 0;
      this.notifications.forEach((n) => (n.isRead = true));
      this._cdr.detectChanges();
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isSidebarOpen = !this.isSidebarOpen;
    
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
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  closeNotificationsOnOutsideClick(event: MouseEvent) {
    const container = (event.target as HTMLElement).closest('.notification-container');
    if (!container && this.showNotifications) {
      this.showNotifications = false;
    }
  }

  ngOnDestroy() {
    if (this._notifSub) {
      this._notifSub.unsubscribe();
    }
    if (this._routerSub) {
      this._routerSub.unsubscribe();
    }
  }
}
