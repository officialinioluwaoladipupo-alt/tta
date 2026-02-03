import { createClientServer } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";
import { queryAirtable } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
    const supabase = await createClientServer();

    const { data: submissions, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.warn("[Dashboard] Error fetching submissions:", error.message);
    }

    const events = await queryAirtable("tblbv7qDvZjkWz298", {
        sort: [{ field: "fldnqKLlla00mhERq", direction: "desc" }],
        returnFieldsByFieldId: true
    });

    const highlights = await queryAirtable("tblA6otl7k9GEIKzr", {
        sort: [{ field: "fldm41s0glSxCrw4Z", direction: "desc" }], // Sort by isActive ID
        returnFieldsByFieldId: true
    });

    return (
        <DashboardClient
            initialSubmissions={submissions || []}
            initialEvents={events || []}
            initialHighlights={highlights || []}
        />
    );
}
