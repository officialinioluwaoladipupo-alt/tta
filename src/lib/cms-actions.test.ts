import { describe, expect, it } from "vitest";
import { createImageUploadSignature, saveSubmission } from "./cms-actions";

describe("CMS actions", () => {
  it("rejects persistence when Neon is not configured", async () => {
    const result = await saveSubmission({ type: "test", email: "test@example.com", name: "Test", data: {} });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Database");
  });

  it("blocks image uploads without an authenticated editor", async () => {
    await expect(createImageUploadSignature("test.png", "event")).rejects.toThrow(/Unauthorized|request scope/);
  });
});
