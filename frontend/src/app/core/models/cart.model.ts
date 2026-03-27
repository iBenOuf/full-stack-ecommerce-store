import { IProduct } from './product.model';

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
}

export interface ICartItem {
  product: string | any;
  quantity: number;
  unitPrice: number;
}

export interface ICartResponse {
  message: string;
  data: ICart;
}

export interface CartDisplayItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product: IProduct | null;
}
