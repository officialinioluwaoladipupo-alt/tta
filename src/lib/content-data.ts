import { sql } from "./db";

export async function queryContent(_tableName: string, _options: Record<string, unknown> = {}): Promise<any[]> {
  if (!sql) return [];
  const table = _tableName.toLowerCase();
  if (!["events", "highlights", "programs", "settings"].includes(table)) return [];
  try {
    const rows = await sql.query(`SELECT id, data FROM ${table} ORDER BY created_at DESC`);
    return rows.map((row) => ({ id: row.id, ...(row.data as Record<string, unknown>) }));
  } catch (error) {
    console.warn(`[Content] Neon read failed for ${table}; using fallback content.`, error instanceof Error ? error.message : error);
    return [];
  }
}

export function getImageUrl(field: unknown): string | undefined {
  return Array.isArray(field) && field.length > 0 && typeof field[0] === "object" && field[0] !== null && "url" in field[0]
    ? String((field[0] as { url: unknown }).url)
    : undefined;
}
