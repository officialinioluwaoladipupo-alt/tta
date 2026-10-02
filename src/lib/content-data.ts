import { sql } from "./db";

export type ContentRecord = Record<string, unknown> & { id: string };

export async function queryContent(tableName: string, options: Record<string, unknown> = {}): Promise<ContentRecord[]> {
  void options;
  if (!sql) return [];
  const table = tableName.toLowerCase();
  if (!["events", "highlights", "programs", "settings"].includes(table)) return [];
  try {
    const rows = await sql.query(`SELECT id, data FROM ${table} ORDER BY created_at DESC`);
    return rows.map((row) => ({ id: String(row.id), ...(row.data as Record<string, unknown>) }));
  } catch (error) {
    console.warn(`[Content] Neon read failed for ${table}; using fallback content.`, error instanceof Error ? error.message : error);
    return [];
  }
}

export function getImageUrl(field: unknown): string | undefined {
  if (!Array.isArray(field) || field.length === 0 || typeof field[0] !== "object" || field[0] === null || !("url" in field[0])) return undefined;
  const url = (field[0] as { url: unknown }).url;
  return typeof url === "string" ? url : undefined;
}

export function contentString(record: ContentRecord, ...keys: string[]): string | undefined {
  for (const key of keys) if (typeof record[key] === "string") return record[key] as string;
  return undefined;
}
