import { describe, expect, it } from "vitest";
import { changedFields } from "./audit";
import { isAdminUser } from "./authorization";

describe("audit authorization and changes", () => {
  it("records exactly the changed before/after fields", () => {
    expect(changedFields({ title: "Old", location: "Lagos" }, { title: "New", location: "Lagos" })).toEqual({ title: { before: "Old", after: "New" } });
  });

  it("allows only verified admins to read audit logs", () => {
    expect(isAdminUser({ email: "admin@example.com", email_verified: true, "https://thethinkingarchitects/claims/roles": ["admin"] })).toBe(true);
    expect(isAdminUser({ email: "editor@example.com", email_verified: true, "https://thethinkingarchitects/claims/roles": ["editor"] })).toBe(false);
    expect(isAdminUser({ email: "admin@example.com", email_verified: false, "https://thethinkingarchitects/claims/roles": ["admin"] })).toBe(false);
  });
});
