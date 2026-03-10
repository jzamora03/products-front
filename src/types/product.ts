import type { Category } from './category';
import type { Pagination } from './pagination';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number;
}

export type UpdateProductPayload = CreateProductPayload;