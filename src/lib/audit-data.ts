import { sql } from "./db";

export type AuditFilters = { actor?: string; action?: string; contentType?: string };
export async function getAuditLogs(filters: AuditFilters, page: number, pageSize = 50) {
  if (!sql) return { rows: [], total: 0 };
  const values: unknown[] = [];
  const conditions = ["1 = 1"];
  const add = (value: unknown) => { values.push(value); return `$${values.length}`; };
  if (filters.actor) conditions.push(`lower(actor_email) LIKE ${add(`%${filters.actor.toLowerCase()}%`)}`);
  if (filters.action) conditions.push(`action = ${add(filters.action)}`);
  if (filters.contentType) conditions.push(`content_type = ${add(filters.contentType)}`);
  const where = conditions.join(" AND ");
  const count = await sql.query(`SELECT COUNT(*)::int AS total FROM audit_logs WHERE ${where}`, values);
  const offset = Math.max(0, page - 1) * pageSize;
  const rows = await sql.query(`SELECT id, actor_email, actor_roles, action, content_type, record_id, changes, created_at FROM audit_logs WHERE ${where} ORDER BY created_at DESC, id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`, [...values, pageSize, offset]);
  return { rows, total: Number(count[0]?.total || 0) };
}
