import { useState, useEffect } from 'react';
import { auditLogsApi } from '../api/products';
import type { AuditLog, Pagination } from '../types';

export default function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    auditLogsApi.list({ page })
      .then(({ data }) => {
        if (!cancelled) {
          setLogs(data.data);
          setPagination(data.pagination);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Error loading audit logs.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page]);

  function formatChanges(changes: Record<string, unknown> | null): string {
    if (!changes || Object.keys(changes).length === 0) return '—';
    return Object.entries(changes)
      .filter(([key]) => !['created_at', 'updated_at', 'deleted_at'].includes(key))
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="audit-section">
      <div className="audit-header">
        <h2 className="audit-title">
          <span className="audit-dot" />
          Audit Log
        </h2>
        <span className="audit-subtitle">All product activity</span>
      </div>

      {loading && (
        <div className="state-container">
          <div className="spinner" />
          <p>Loading logs...</p>
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
                  <th>Date</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>ID</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">No activity yet.</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td className="td-date">{formatDate(log.created_at)}</td>
                      <td>
                        <span className={`action-badge action-${log.action}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="td-entity">{log.entity}</td>
                      <td><span className="sku-badge">#{log.entity_id}</span></td>
                      <td className="td-changes">{formatChanges(log.changes)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                ← Previous
              </button>
              <span className="page-info">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button className="page-btn" disabled={page === pagination.last_page} onClick={() => setPage(p => p + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}