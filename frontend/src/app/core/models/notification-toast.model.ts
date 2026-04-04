import { NotificationType } from './notification.model';

export interface INotificationToast {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
}
