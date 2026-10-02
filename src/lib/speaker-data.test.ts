import { describe, expect, it } from "vitest";
import { reorderSpeakers } from "./speaker-data";
import { validateImageData } from "./image-validation";

describe("speaker editor safety", () => {
  it("persists reordered speaker order", () => {
    const speakers = [{ id: "a", name: "A" }, { id: "b", name: "B" }, { id: "c", name: "C" }];
    expect(reorderSpeakers(speakers, 2, 0).map((speaker) => speaker.id)).toEqual(["c", "a", "b"]);
  });

  it("rejects non-images", async () => {
    expect((await validateImageData("data:text/plain;base64,SGVsbG8=")).valid).toBe(false);
  });

  it("rejects images over 5 MB", async () => {
    const oversized = `data:image/png;base64,${"A".repeat(7_000_000)}`;
    expect((await validateImageData(oversized)).valid).toBe(false);
  });
});
