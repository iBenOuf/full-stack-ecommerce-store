export interface IToast {
  id: number;
  message: string;
  type: ToastType;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';
