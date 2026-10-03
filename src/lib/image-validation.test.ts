import { describe, expect, it } from "vitest";
import { validateImageMetadata } from "./image-validation";

describe("Cloudinary image metadata validation", () => {
  it("rejects types outside JPEG, PNG, and WebP", async () => {
    const result = await validateImageMetadata({ format: "gif", width: 1200, height: 1200, size: 1000 }, "event");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPEG, PNG, and WebP");
  });

  it("rejects assets larger than 5 MB", async () => {
    const result = await validateImageMetadata({ format: "png", width: 1200, height: 1200, size: 5 * 1024 * 1024 + 1 }, "event");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("5 MB");
  });

  it("applies the team photo minimum dimensions", async () => {
    const result = await validateImageMetadata({ format: "jpeg", width: 399, height: 500, size: 1000 }, "team");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("400×400");
  });

  it("accepts valid image metadata", async () => {
    const result = await validateImageMetadata({ format: "webp", width: 1200, height: 1200, size: 1000 }, "event");
    expect(result.valid).toBe(true);
  });
});
