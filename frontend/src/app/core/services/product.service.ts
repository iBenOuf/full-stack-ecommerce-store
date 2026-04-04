import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  IProductResponse,
  IProductsPaginatedResponse,
  IProductsResponse,
  IProductsFilterParams,
  cleanParams,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'product';

  getAllProducts() {
    return this._http.get<IProductsResponse>(this.apiURL);
  }

  getBestSellerProducts(limit: number) {
    return this._http.get<IProductsResponse>(this.apiURL + '/best-sellers', {
      params: { limit },
    });
  }

  getProductBySlug(slug: string) {
    return this._http.get<IProductResponse>(this.apiURL + '/slug/' + slug);
  }

  getRelatedProducts(productId: string, subcategoryId: string) {
    return this._http.get<IProductsResponse>(this.apiURL + '/related', {
      params: { productId, subcategoryId },
    });
  }

  getProductById(id: string) {
    return this._http.get<IProductResponse>(this.apiURL + '/id/' + id);
  }

  getProducts(params: IProductsFilterParams) {
    const cleanParams: cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanParams[key] = val;
    });
    return this._http.get<IProductsPaginatedResponse>(`${this.apiURL}/list`, {
      params: cleanParams,
    });
  }

  getAdminProducts(params: IProductsFilterParams) {
    const cleanParams: cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanParams[key] = val;
    });
    return this._http.get<IProductsPaginatedResponse>(`${this.apiURL}/admin`, {
      params: cleanParams,
    });
  }

  createProduct(data: FormData) {
    return this._http.post<IProductResponse>(this.apiURL, data);
  }

  updateProduct(id: string, data: FormData | { isActive: boolean }) {
    return this._http.put<IProductResponse>(`${this.apiURL}/${id}`, data);
  }

  deleteProduct(id: string) {
    return this._http.delete<{ message: string }>(`${this.apiURL}/${id}`);
  }
}
