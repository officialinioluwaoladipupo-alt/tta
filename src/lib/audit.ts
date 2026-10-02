import { auth0 } from "./auth0";
import { sql } from "./db";
const AUTH_CLAIMS_NAMESPACE = "https://thethinkingarchitects/claims";

export type AuditAction = "create" | "update" | "delete" | "export" | "login_denied";

function safeValue(value: unknown, key = ""): unknown {
  if (/secret|token|password|session|cookie|authorization|bytes/i.test(key)) return "[redacted]";
  if (typeof value === "string" && value.length > 20_000) return `${value.slice(0, 20_000)}…`;
  if (Array.isArray(value)) return value.map((item) => safeValue(item, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, safeValue(childValue, childKey)]));
  return value;
}

export function changedFields(before: Record<string, unknown> | null | undefined, after: Record<string, unknown> | null | undefined) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  return Object.fromEntries([...keys].filter((key) => JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])).map((key) => [key, { before: safeValue(before?.[key], key), after: safeValue(after?.[key], key) }]));
}

function normalizeChanges(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeChanges);
  if (!value || typeof value !== "object") return value;
  const object = value as Record<string, unknown>;
  if ("before" in object && "after" in object && (typeof object.before === "object" || typeof object.after === "object")) {
    return changedFields((object.before || {}) as Record<string, unknown>, (object.after || {}) as Record<string, unknown>);
  }
  return Object.fromEntries(Object.entries(object).map(([key, child]) => [key, normalizeChanges(child)]));
}

export async function logAudit(input: { action: AuditAction; contentType: string; recordId?: string | null; changes?: unknown; ip?: string | null }) {
  try {
    if (!sql) return;
    const session = await auth0.getSession();
    const user = session?.user as Record<string, unknown> | undefined;
    const rolesValue = user?.[`${AUTH_CLAIMS_NAMESPACE}/roles`];
    const roles = Array.isArray(rolesValue) ? rolesValue.filter((role): role is string => typeof role === "string") : [];
    const email = typeof user?.email === "string" ? user.email : "";
    await sql`INSERT INTO audit_logs (actor_email, actor_roles, action, content_type, record_id, changes, ip) VALUES (${email}, ${roles}, ${input.action}, ${input.contentType}, ${input.recordId ?? null}, ${JSON.stringify(safeValue(normalizeChanges(input.changes ?? {})))}, ${input.ip ?? null})`;
  } catch (error) {
    console.error("[Audit] Failed to write audit log", error instanceof Error ? error.message : "unknown error");
  }
}
