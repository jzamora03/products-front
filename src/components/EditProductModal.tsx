import { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '../api/products';
import type { Product } from '../types';  // ← moverlo a types
import type { Category, CreateProductPayload } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
}

interface FormState {
  name: string;
  sku: string;
  price: string;
  stock: string;
  category_id: string;
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
  category_id?: string;
}

export default function EditProductModal({ product, onClose, onUpdated }: Props) {
  const [form, setForm] = useState<FormState>({
    name: product.name,
    sku: product.sku,
    price: String(product.price),
    stock: String(product.stock),
    category_id: String(product.category_id),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi.list()
      .then(r => setCategories(r.data.data))
      .catch(() => { });
  }, []);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) e.stock = 'Stock must be a non-negative integer';
    if (!form.category_id) e.category_id = 'Category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const payload: CreateProductPayload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      };
      await productsApi.update(product.id, payload);
      onUpdated();
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Error updating product.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {apiError && <div className="api-error">{apiError}</div>}

          {(['name', 'sku', 'price', 'stock'] as const).map(key => (
            <div className="field" key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={key}
              />
              {errors[key] && <span className="field-error">{errors[key]}</span>}
            </div>
          ))}

          <div className="field">
            <label>Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <span className="field-error">{errors.category_id}</span>}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}