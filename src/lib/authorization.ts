import { auth0 } from "./auth0";
import { redirect } from "next/navigation";
import { logAudit } from "./audit";

export const AUTH_CLAIMS_NAMESPACE = "https://thethinkingarchitects/claims";

export const PERMISSIONS = [
  "read:dashboard",
  "edit:events",
  "edit:highlights",
  "edit:media",
  "delete:content",
  "manage:settings",
  "manage:team",
  "export:data",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
export type AuthorizationMode = "page" | "api";

export class AuthorizationError extends Error {
  constructor(public readonly status: 401 | 403, message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

function claimValues(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return typeof value === "string" ? [value] : [];
}

export function getSessionPermissions(user: Record<string, unknown> | undefined): Set<string> {
  const permissions = claimValues(user?.[`${AUTH_CLAIMS_NAMESPACE}/permissions`]);
  const roles = claimValues(user?.[`${AUTH_CLAIMS_NAMESPACE}/roles`]);
  const rolePermissions = new Set<string>(permissions);
  if (roles.includes("admin")) return new Set(PERMISSIONS);
  if (roles.includes("editor")) {
    ["read:dashboard", "edit:events", "edit:highlights", "edit:media"].forEach((permission) => rolePermissions.add(permission));
  }
  if (roles.includes("viewer")) rolePermissions.add("read:dashboard");
  return rolePermissions;
}

function isEmailFallbackAdmin(user: Record<string, unknown> | undefined, enabled = process.env.AUTH_ALLOW_EMAIL_FALLBACK === "true"): boolean {
  if (!enabled) return false;
  const email = typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";
  if (!email) return false;
  const allowlist = (process.env.AUTH0_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.length > 0 && allowlist.includes(email);
}

export function checkPermission(user: Record<string, unknown> | undefined, permission: Permission, fallbackEnabled = process.env.AUTH_ALLOW_EMAIL_FALLBACK === "true"): 401 | 403 | null {
  if (!user) return 401;
  if (user.email_verified !== true) return 403;
  if (isEmailFallbackAdmin(user, fallbackEnabled)) return null;
  return getSessionPermissions(user).has(permission) ? null : 403;
}

export async function requirePermission(permission: Permission, mode: AuthorizationMode = "api") {
  const session = await auth0.getSession();
  if (!session?.user) {
    await logAudit({ action: "login_denied", contentType: "authorization", recordId: permission, changes: { reason: "missing_session" } });
    if (mode === "page") redirect("/auth/login");
    throw new AuthorizationError(401, "Authentication required");
  }

  const user = session.user as Record<string, unknown>;
  const denial = checkPermission(user, permission);
  if (denial === 403) {
    await logAudit({ action: "login_denied", contentType: "authorization", recordId: permission, changes: { reason: user.email_verified === true ? "missing_permission" : "email_not_verified" } });
    throw new AuthorizationError(403, "Permission denied");
  }

  const permissions = getSessionPermissions(user);
  if (isEmailFallbackAdmin(user)) return { session, permissions: new Set(PERMISSIONS) };
  return { session, permissions };
}

export async function requireAdmin(mode: AuthorizationMode = "api") {
  const session = await auth0.getSession();
  if (!session?.user) {
    await logAudit({ action: "login_denied", contentType: "audit_logs", changes: { reason: "missing_session" } });
    if (mode === "page") redirect("/auth/login");
    throw new AuthorizationError(401, "Authentication required");
  }
  const user = session.user as Record<string, unknown>;
  if (!isAdminUser(user)) {
    await logAudit({ action: "login_denied", contentType: "audit_logs", changes: { reason: "admin_required" } });
    throw new AuthorizationError(403, "Admin permission required");
  }
  return { session };
}

export function isAdminUser(user: Record<string, unknown> | undefined) {
  if (!user || user.email_verified !== true) return false;
  const roles = claimValues(user[`${AUTH_CLAIMS_NAMESPACE}/roles`]);
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  const allowlist = (process.env.AUTH0_ADMIN_EMAILS || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return roles.includes("admin") || (process.env.AUTH_ALLOW_EMAIL_FALLBACK === "true" && allowlist.length > 0 && allowlist.includes(email));
}

export function permissionsForUser(user: Record<string, unknown> | undefined): string[] {
  return [...getSessionPermissions(user)];
}
