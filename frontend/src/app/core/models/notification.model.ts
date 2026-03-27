export type NotificationType = 'new_order' | 'low_stock' | 'new_testimonial' | 'system';

export interface INotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  data?: any;
  createdAt: string;
}

export interface INotificationsResponse {
  message: string;
  data: INotification[];
}

export interface INotificationResponse {
  message: string;
  data: INotification;
}
