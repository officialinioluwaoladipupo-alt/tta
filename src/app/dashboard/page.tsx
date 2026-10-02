import DashboardClient from "./DashboardClient";
import { requirePermission } from "@/lib/authorization";
import { sql } from "@/lib/db";
import type { ContentRecord, EventFields, HighlightFields } from "@/lib/cms-types";
import { getSubmissions, SUBMISSION_TYPES, type SubmissionFilters, type SubmissionType } from "@/lib/submission-data";

export const dynamic = "force-dynamic";

function normalizeContentRecord(row: Record<string, unknown>) {
    const data = (row.data && typeof row.data === "object" ? row.data : {}) as Record<string, unknown>;
    return { id: String(row.id), ...data };
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const { permissions } = await requirePermission("read:dashboard", "page");
    const params = await searchParams;
    const value = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
    const rawType = value("type");
    const filters: SubmissionFilters = {
        search: value("search"),
        type: SUBMISSION_TYPES.includes(rawType as SubmissionType) ? rawType as SubmissionType : undefined,
        from: value("from"),
        to: value("to"),
    };
    const page = Math.max(1, Number.parseInt(value("page") || "1", 10) || 1);
    const submissionResult = await getSubmissions(filters, page);
    const submissions = submissionResult.rows;
    let events: ContentRecord<EventFields>[] = [];
    let highlights: ContentRecord<HighlightFields>[] = [];
    let settings: Record<string, unknown> | undefined;
    if (sql) {
        try {
            events = (await sql`SELECT id, data FROM events ORDER BY created_at DESC`).map(normalizeContentRecord) as ContentRecord<EventFields>[];
            highlights = (await sql`SELECT id, data FROM highlights ORDER BY created_at DESC`).map(normalizeContentRecord) as ContentRecord<HighlightFields>[];
            settings = (await sql`SELECT data FROM settings ORDER BY created_at DESC LIMIT 1`)[0]?.data as Record<string, unknown> | undefined;
        } catch (error) {
            console.warn("[Dashboard] Neon read failed; loading empty dashboard state.", error instanceof Error ? error.message : error);
        }
    }
    return (
        <DashboardClient
            initialSubmissions={submissions}
            initialEvents={events}
            initialHighlights={highlights}
            initialSettings={settings}
            permissions={[...permissions]}
            submissionFilters={filters}
            submissionPage={page}
            submissionTotal={submissionResult.total}
            submissionError={submissionResult.error}
        />
    );
}
