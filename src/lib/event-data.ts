import { queryContent, getImageUrl } from "@/lib/content-data";
import type { ContentRecord } from "@/lib/content-data";

export interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "url" | "select" | "textarea";
    required?: boolean;
    options?: string[]; // For select inputs
    placeholder?: string;
}

export interface Speaker {
    id: string;
    name: string;
    role?: string;
    organization?: string;
    title?: string;
    topic?: string;
    bio?: string;
    avatar?: string;
    publicId?: string;
}

export interface Event {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    sessionNumber?: string;
    format: string;
    recordingUrl?: string;
    sessionNotes?: string;
    resources: string[];
    date: string; // ISO string for sorting
    displayDate: string; // "Feb 12, 2026"
    time: string; // "19:00"
    location: string;
    link?: string;
    image: string;
    tags: string[];
    status: "upcoming" | "past" | "full";
    speakers?: Speaker[];
    formFields?: FormField[]; // Dynamic content fields
    learningPoints?: string[]; // Dynamic content data
    seoImage?: string;
    seoDescription?: string;
}

// Map stored content to the public Event interface.
function mapContentEvent(record: ContentRecord): Event {
    const readString = (key: string, fallback = "") => typeof record[key] === "string" ? record[key] as string : fallback;
    const dateValue = readString("date", readString("startDate", new Date().toISOString()));
    const dateObj = new Date(dateValue);
    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // Handle speakers
    let speakers: Speaker[] = [];
    try {
        const speakersVal = record.speakers;
        if (typeof speakersVal === "string") {
            const parsed: unknown = JSON.parse(speakersVal);
            speakers = Array.isArray(parsed) ? parsed.filter((speaker): speaker is Speaker => typeof speaker === "object" && speaker !== null && "name" in speaker) : [];
        } else if (Array.isArray(speakersVal)) {
            speakers = speakersVal.filter((speaker): speaker is Speaker => typeof speaker === "object" && speaker !== null && "name" in speaker);
        }
    } catch {
        console.warn("Failed to parse speakers for event:", record.id);
    }

    // Handle form fields
    let formFields: FormField[] = [];
    try {
        const fieldsVal = record.formFields;
        if (typeof fieldsVal === "string") {
            const parsed: unknown = JSON.parse(fieldsVal);
            formFields = Array.isArray(parsed) ? parsed.filter((field): field is FormField => typeof field === "object" && field !== null && "name" in field && "label" in field) : [];
        } else if (Array.isArray(fieldsVal)) {
            formFields = fieldsVal.filter((field): field is FormField => typeof field === "object" && field !== null && "name" in field && "label" in field);
        }
    } catch {
        console.warn("Failed to parse formFields for event:", record.id);
    }

    // Handle learning points
    let learningPoints: string[] = [];
    try {
        const lpVal = record.learningPoints;
        if (typeof lpVal === "string") {
            learningPoints = lpVal.split(/\n|,/).map(p => p.trim()).filter(p => p);
        } else if (Array.isArray(lpVal)) {
            learningPoints = lpVal.filter((point): point is string => typeof point === "string");
        }
    } catch {
        console.warn("Failed to parse learning points for event:", record.id);
    }

    return {
        id: record.id,
        slug: readString("slug", record.id),
        title: readString("title", "Untitled session"),
        description: readString("description"),
        shortDescription: readString("shortDescription"),
        sessionNumber: readString("sessionNumber") || undefined,
        format: readString("format", readString("location", "Online")),
        recordingUrl: readString("recordingUrl") || undefined,
        sessionNotes: readString("sessionNotes") || undefined,
        resources: readString("resources").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        date: dateValue,
        displayDate,
        time: `${time} WAT`,
        location: readString("location", "Online"),
        link: typeof record.link === "string" ? record.link : undefined,
        image: readString("image") || getImageUrl(record.image) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        tags: typeof record.tags === "string" ? record.tags.split(",") : Array.isArray(record.tags) ? record.tags.filter((tag): tag is string => typeof tag === "string") : ["Masterclass"],
        status: record.status === "past" || dateObj < new Date() ? "past" : record.status === "full" ? "full" : "upcoming",
        speakers,
        formFields,
        learningPoints,
        seoImage: getImageUrl(record.seoImage),
        seoDescription: readString("seoDescription") || undefined
    };
}

export async function getUpcomingEvents(): Promise<Event[]> {
    const records = await queryContent("events", {
        sort: [{ field: "date", direction: "asc" }],
    });

    const now = new Date();

    return records
        .filter(isPublicEventRecord)
        .map(mapContentEvent)
        .filter(event => {
            const eventDate = new Date(event.date);
            // Show events that are today or in the future
            return eventDate >= now && event.status !== "past";
        });
}

export async function getPastEvents(): Promise<Event[]> {
    const records = await queryContent("events");
    const today = new Date();
    return records
        .filter(isPublicEventRecord)
        .map(mapContentEvent)
        .filter((event) => new Date(event.date) < today || event.status === "past")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
    const records = await queryContent("events");

    const record = records.find((r) => r.slug === slug || r.id === slug);
    if (!record) return undefined;

    if (!isPublicEventRecord(record)) return undefined;

    return mapContentEvent(record);
}

function isPublicEventRecord(record: ContentRecord) {
    const status = typeof record.status === "string" ? record.status.toLowerCase() : "";
    return record.isPublished !== false && record.published !== false && status !== "draft" && status !== "unpublished";
}
