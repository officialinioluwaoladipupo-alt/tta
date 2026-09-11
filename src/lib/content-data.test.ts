import { describe, expect, it } from "vitest";
import { getImageUrl, queryContent } from "./content-data";

describe("content data", () => {
  it("extracts a safe image URL", () => {
    expect(getImageUrl([{ url: "https://example.com/image.jpg" }])).toBe("https://example.com/image.jpg");
    expect(getImageUrl([])).toBeUndefined();
    expect(getImageUrl("not-an-attachment")).toBeUndefined();
  });

  it("returns an empty local collection when no database is configured", async () => {
    await expect(queryContent("events")).resolves.toEqual([]);
  });
});
