import { describe, expect, it } from "vitest";
import { buildSubmissionQuery, csvCell, submissionsToCsv } from "./submission-data";

describe("submission filters and export", () => {
  it("builds case-insensitive partial name/email search", () => {
    const query = buildSubmissionQuery({ search: "Ada" }, 1);
    expect(query.where).toContain("lower(name) LIKE");
    expect(query.where).toContain("lower(email) LIKE");
    expect(query.values).toEqual(["%ada%"]);
  });

  it.each(["newsletter", "join", "event"] as const)("filters by %s type", (type) => {
    expect(buildSubmissionQuery({ type }, 1).where).toContain("type = $1");
  });

  it("filters by date range", () => {
    const query = buildSubmissionQuery({ from: "2026-01-01", to: "2026-01-31" }, 1);
    expect(query.where).toContain("created_at >= $1::date");
    expect(query.where).toContain("created_at < $2::date");
  });

  it("calculates page two at fifty rows per page", () => {
    expect(buildSubmissionQuery({}, 2)).toMatchObject({ limit: 50, offset: 50 });
  });

  it("prefixes formula-like CSV cells", () => {
    for (const value of ["=SUM(A1)", "+123", "-123", "@user", "\tdata", "\rdata"]) {
      expect(csvCell(value).startsWith("\"'")) .toBe(true);
    }
  });

  it("escapes and exports submission rows", () => {
    const csv = submissionsToCsv([{ id: "1", created_at: "2026-01-01", type: "newsletter", name: "=Name", email: "a@example.com", data: { note: "hello" } }]);
    expect(csv).toContain("\"'=Name\"");
    expect(csv).toContain("Data");
  });
});
