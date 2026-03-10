import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';

import type { Product, Pagination } from '../types';

interface UseProductsParams {
  page: number;
  search: string;
  categoryId?: number;
  refreshKey?: number;
}

interface UseProductsResult {
  products: Product[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

export function useProducts({ page, search, categoryId, refreshKey }: UseProductsParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: Record<string, unknown> = { page };
    if (search) params.search = search;
    if (categoryId) params.category_id = categoryId;

    productsApi
      .list(params)
      .then(({ data }) => {
        if (!cancelled) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Error loading products. Check that the API is running.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, search, categoryId, refreshKey]);

  return { products, pagination, loading, error };
}