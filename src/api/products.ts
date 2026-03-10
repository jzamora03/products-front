import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Authorization': 'Bearer mytoken123',
    'Content-Type': 'application/json',
  },
});

export interface Category {
  id: number;
  name: string;
  slug: string;
}

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

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
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

export const productsApi = {
  list: (params: { page?: number; search?: string; category_id?: number }) =>
    api.get<ProductsResponse>('/products', { params }),

  create: (payload: CreateProductPayload) =>
    api.post<Product>('/products', payload),

  categories: () =>
    api.get<{ data: Category[] }>('/categories'),
};

export default api;