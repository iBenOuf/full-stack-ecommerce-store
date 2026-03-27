export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'canceled_by_client'
  | 'canceled_by_admin'
  | 'shipped'
  | 'delivered'
  | 'rejected'
  | 'returned';

export interface IOrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  _id: string;
  user: string | { _id: string; firstName: string; lastName: string; email: string };
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    governorate: string;
  };
  deliveryPhone: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  message: string;
  data: IOrder;
}

export interface IOrdersResponse {
  message: string;
  data: IOrder[];
}

export interface ICreateOrder {
  shippingAddress: {
    street: string;
    city: string;
    governorate: string;
  };
  deliveryPhone: string;
}
