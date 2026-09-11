import DashboardClient from "./DashboardClient";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import type { ContentRecord, EventFields, HighlightFields } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

function normalizeContentRecord(row: Record<string, unknown>) {
    const data = (row.data && typeof row.data === "object" ? row.data : {}) as Record<string, unknown>;
    return { id: String(row.id), ...data };
}

export default async function Dashboard() {
    if (!(await auth0.getSession())) redirect("/auth/login");
    let submissions: never[] = [];
    let events: ContentRecord<EventFields>[] = [];
    let highlights: ContentRecord<HighlightFields>[] = [];
    let settings: Record<string, unknown> | undefined;
    if (sql) {
        try {
            submissions = await sql`SELECT * FROM submissions ORDER BY created_at DESC` as never[];
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
        />
    );
}
