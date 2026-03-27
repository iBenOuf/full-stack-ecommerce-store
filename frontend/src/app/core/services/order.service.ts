import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICreateOrder, IOrder, IOrderResponse, IOrdersResponse } from '../models/order.model';

import { ICart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiURL + 'order';

  createOrder(order: ICreateOrder) {
    return this.http.post<IOrderResponse>(this.baseUrl, order);
  }
  getAllOrders() {
    return this.http.get<IOrdersResponse>(this.baseUrl);
  }
  getOrdersByUserId(userId: string) {
    return this.http.get<IOrdersResponse>(`${this.baseUrl}/user/${userId}`);
  }
  getOrderById(orderId: string) {
    return this.http.get<IOrderResponse>(`${this.baseUrl}/details/${orderId}`);
  }
  updateOrderStatus(orderId: string, status: string) {
    return this.http.patch<IOrderResponse>(`${this.baseUrl}/${orderId}`, { status });
  }
  reorder(orderId: string) {
    return this.http.post<{
      message: string;
      data: { cart: ICart; skippedItems: string[]; addedItems: string[] };
    }>(`${this.baseUrl}/reorder/${orderId}`, {});
  }
}
