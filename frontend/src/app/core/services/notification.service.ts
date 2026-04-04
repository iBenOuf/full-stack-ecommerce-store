import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import {
  INotification,
  INotificationResponse,
  INotificationsResponse,
} from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket | null = null;
  private apiURL = environment.apiURL + 'notification';

  private newNotificationSubject = new BehaviorSubject<INotification | null>(null);
  public newNotification$ = this.newNotificationSubject.asObservable();

  constructor(private _http: HttpClient) {}

  getAllNotifications() {
    return this._http.get<INotificationsResponse>(this.apiURL);
  }

  getUnreadCount() {
    return this._http.get<{ message: string; data: { count: number } }>(`${this.apiURL}/unread-count`);
  }

  markAsRead(id: string) {
    return this._http.patch<INotificationResponse>(`${this.apiURL}/${id}/read`, {});
  }

  markAllAsRead() {
    return this._http.patch<{ message: string }>(`${this.apiURL}/read-all`, {});
  }

  deleteNotification(id: string) {
    return this._http.delete<{ message: string }>(`${this.apiURL}/${id}`);
  }

  connect(token: string) {
    if (this.socket) {
      if (this.socket.connected) return;
      this.socket.disconnect();
      this.socket = null;
    }

    const parsedUrl = new URL(environment.apiURL);
    const socketUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    this.socket = io(socketUrl, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected to notification server after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_error', (err) => {
      console.error('Socket reconnection error:', err.message);
    });

    this.socket.on('new_order', (data: any) => this.handleIncoming(data));
    this.socket.on('low_stock', (data: any) => this.handleIncoming(data));
    this.socket.on('new_testimonial', (data: any) => this.handleIncoming(data));
    this.socket.on('order_canceled', (data: any) => this.handleIncoming(data));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private handleIncoming(data: any) {
    const notification: INotification = {
      _id: data._id,
      type: data.type,
      title: data.title || 'New Notification',
      message: data.message || '',
      isRead: data.isRead || false,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    this.newNotificationSubject.next(notification);
  }
}
