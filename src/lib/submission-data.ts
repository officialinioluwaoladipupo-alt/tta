import { sql } from "./db";

export const SUBMISSION_TYPES = ["newsletter", "join", "event"] as const;
export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export interface SubmissionFilters {
  search?: string;
  type?: SubmissionType;
  from?: string;
  to?: string;
}

export interface SubmissionRow {
  id: string;
  created_at: string;
  type: string;
  name: string;
  email: string;
  data: unknown;
}

export function buildSubmissionQuery(filters: SubmissionFilters, page: number, pageSize = 50) {
  const values: unknown[] = [];
  const conditions = ["1 = 1"];
  const add = (value: unknown) => { values.push(value); return `$${values.length}`; };
  if (filters.search) {
    const search = add(`%${filters.search.toLowerCase()}%`);
    conditions.push(`(lower(name) LIKE ${search} OR lower(email) LIKE ${search})`);
  }
  if (filters.type) conditions.push(`type = ${add(filters.type)}`);
  if (filters.from && /^\d{4}-\d{2}-\d{2}$/.test(filters.from)) conditions.push(`created_at >= ${add(filters.from)}::date`);
  if (filters.to && /^\d{4}-\d{2}-\d{2}$/.test(filters.to)) conditions.push(`created_at < ${add(filters.to)}::date + INTERVAL '1 day'`);
  const offset = Math.max(0, page - 1) * pageSize;
  return { where: conditions.join(" AND "), values, limit: pageSize, offset };
}

export async function getSubmissions(filters: SubmissionFilters, page: number, pageSize = 50) {
  if (!sql) return { rows: [] as SubmissionRow[], total: 0, error: "Database unavailable" };
  const { where, values, offset } = buildSubmissionQuery(filters, page, pageSize);
  try {
    const countRows = await sql.query(`SELECT COUNT(*)::int AS total FROM submissions WHERE ${where}`, values);
    const rows = await sql.query(
      `SELECT id, created_at, type, name, email, data FROM submissions WHERE ${where} ORDER BY created_at DESC, id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, offset]
    );
    return { rows: rows as SubmissionRow[], total: Number(countRows[0]?.total || 0), error: undefined };
  } catch {
    return { rows: [] as SubmissionRow[], total: 0, error: "Database unavailable" };
  }
}

export function csvCell(value: unknown): string {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function submissionsToCsv(rows: SubmissionRow[]): string {
  const headers = ["ID", "Created At", "Type", "Name", "Email", "Data"];
  return [headers.map(csvCell).join(","), ...rows.map((row) => [row.id, row.created_at, row.type, row.name, row.email, row.data].map(csvCell).join(","))].join("\n");
}
