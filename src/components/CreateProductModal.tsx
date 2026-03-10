import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';
import type { Category, CreateProductPayload } from '../api/products';

interface Props {
  onClose: () => void;
  onCreated: () => void;
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

export default function CreateProductModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>({ name: '', sku: '', price: '', stock: '', category_id: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    productsApi.categories()
      .then(r => setCategories(r.data.data))
      .catch(() => {});
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
      await productsApi.create(payload);
      onCreated();
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Error creating product.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function field(key: keyof FormState, label: string, type = 'text', options?: Category[]) {
    return (
      <div className="field">
        <label>{label}</label>
        {options ? (
          <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
            <option value="">Select category...</option>
            {options.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            placeholder={label}
          />
        )}
        {errors[key] && <span className="field-error">{errors[key]}</span>}
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Product</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {apiError && <div className="api-error">{apiError}</div>}
          {field('name', 'Name')}
          {field('sku', 'SKU')}
          {field('price', 'Price', 'number')}
          {field('stock', 'Stock', 'number')}
          {field('category_id', 'Category', 'text', categories)}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}