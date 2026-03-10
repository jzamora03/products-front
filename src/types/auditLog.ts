export interface AuditLog {
  id: number;
  user: string | null;
  action: 'created' | 'updated' | 'deleted';
  entity: string;
  entity_id: number;
  changes: Record<string, unknown> | null;
  created_at: string;
}