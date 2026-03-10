import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useProducts } from './hooks/useProducts';
import CreateProductModal from './components/CreateProductModal';
import './App.css';

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 300);
  const { products, pagination, loading, error } = useProducts({
    page,
    search: debouncedSearch,
    // force re-fetch after create
    ...(refreshKey ? {} : {}),
  });

  // Reset page when search changes
  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCreated() {
    setRefreshKey(k => k + 1);
    setPage(1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">P</div>
          <div>
            <h1>Products</h1>
            <span className="subtitle">Catalog Manager</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Product
        </button>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => handleSearch('')}>✕</button>
            )}
          </div>
          {pagination && (
            <span className="results-count">
              {pagination.total} product{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading && (
          <div className="state-container">
            <div className="spinner" />
            <p>Loading products...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-container error">
            <div className="error-icon">⚠</div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">No products found.</td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <td className="td-name">{product.name}</td>
                        <td><span className="sku-badge">{product.sku}</span></td>
                        <td className="td-price">${Number(product.price).toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'ok'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <span className="category-tag">
                            {product.category?.name ?? '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  className="page-btn"
                  disabled={page === pagination.last_page}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showModal && (
        <CreateProductModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}