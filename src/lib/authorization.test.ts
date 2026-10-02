import { describe, expect, it } from "vitest";
import { checkPermission, getSessionPermissions, PERMISSIONS } from "./authorization";

const claims = (roles: string[]) => ({ email: "person@example.com", email_verified: true, "https://thethinkingarchitects/claims/roles": roles });

describe("dashboard authorization", () => {
  it.each([
    ["viewer", ["read:dashboard"]],
    ["editor", ["read:dashboard", "edit:events", "edit:highlights", "edit:media"]],
    ["admin", [...PERMISSIONS]],
  ])("maps %s to its protected route permissions", (role, allowed) => {
    const userPermissions = getSessionPermissions(claims([role]));
    for (const permission of PERMISSIONS) {
      expect(userPermissions.has(permission)).toBe(allowed.includes(permission));
      expect(checkPermission(claims([role]), permission, false)).toBe(allowed.includes(permission) ? null : 403);
    }
  });

  it("denies logged out and unverified users", () => {
    expect(checkPermission(undefined, "read:dashboard", false)).toBe(401);
    expect(checkPermission({ email: "person@example.com", email_verified: false }, "read:dashboard", false)).toBe(403);
  });

  it("allows the email fallback only when explicitly enabled", () => {
    const user = { email: "admin@example.com", email_verified: true };
    const original = process.env.AUTH0_ADMIN_EMAILS;
    process.env.AUTH0_ADMIN_EMAILS = " ADMIN@example.com ";
    expect(checkPermission(user, "manage:team", false)).toBe(403);
    expect(checkPermission(user, "manage:team", true)).toBe(null);
    process.env.AUTH0_ADMIN_EMAILS = original;
  });

  it("denies an empty fallback allowlist", () => {
    const original = process.env.AUTH0_ADMIN_EMAILS;
    process.env.AUTH0_ADMIN_EMAILS = "";
    expect(checkPermission({ email: "admin@example.com", email_verified: true }, "manage:settings", true)).toBe(403);
    process.env.AUTH0_ADMIN_EMAILS = original;
  });
});
