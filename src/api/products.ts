import axios, { AxiosError } from 'axios';

import type {
  Category,
  CreateProductPayload,
  UpdateProductPayload,
  Product,
  ProductsResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error(`[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} →`, error.response?.status);
    return Promise.reject(error);
  }
);

export interface ListProductsParams {
  page?: number;
  search?: string;
  category_id?: number;
}

export const productsApi = {
  list: (params: ListProductsParams) =>
    api.get<ProductsResponse>('/products', { params }),

  create: (payload: CreateProductPayload) =>
    api.post<Product>('/products', payload),

  update: (id: number, payload: UpdateProductPayload) =>
    api.put<Product>(`/products/${id}`, payload),

  remove: (id: number) =>
    api.delete<void>(`/products/${id}`),
};

export const categoriesApi = {
  list: () =>
    api.get<{ data: Category[] }>('/categories'),
};

export interface AuditLogsResponse {
  data: import('../types').AuditLog[];
  pagination: import('../types').Pagination;
}

export const auditLogsApi = {
  list: (params: { page?: number }) =>
    api.get<AuditLogsResponse>('/audit-logs', { params }),
};

export default api;