import { ISubcategory } from './subcategory.model';

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  subcategory: ISubcategory;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface IProductResponse {
  message: string;
  data: IProduct;
}

export interface IProductsResponse {
  message: string;
  data: IProduct[];
}

export interface IProductsPaginatedResponse {
  message: string;
  data: IProductsPaginated;
}

export interface IProductsPaginated {
  data: IProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IProductsFilterParams {
  filter?: string;
  sort?: string;
  subcategorySlug?: string;
  categorySlug?: string;
  inStock?: boolean;
  productId?: string;
  page?: number;
  limit?: number;
}

export type cleanParams = { [key: string]: string };
