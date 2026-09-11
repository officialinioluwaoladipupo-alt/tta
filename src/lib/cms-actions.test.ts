import { describe, expect, it } from "vitest";
import { saveSubmission, uploadImage } from "./cms-actions";

describe("CMS actions", () => {
  it("rejects persistence when Neon is not configured", async () => {
    const result = await saveSubmission({ type: "test", email: "test@example.com", name: "Test", data: {} });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Database");
  });

  it("blocks image uploads without an authenticated editor", async () => {
    await expect(uploadImage("data:image/png;base64,invalid", "test.png")).rejects.toThrow(/Unauthorized|request scope/);
  });
});
