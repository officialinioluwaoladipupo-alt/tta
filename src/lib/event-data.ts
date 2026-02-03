import { queryAirtable, getAirtableImage } from "@/lib/airtable";

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
    role: string;
    avatar: string;
}

export interface Event {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    date: string; // ISO string for sorting
    displayDate: string; // "Feb 12, 2026"
    time: string; // "19:00"
    location: string;
    image: string;
    tags: string[];
    status: "upcoming" | "past" | "full";
    speakers?: Speaker[];
    formFields?: FormField[]; // Dynamic fields from Airtable
    learningPoints?: string[]; // Dynamic from Airtable
    seoImage?: string;
    seoDescription?: string;
}

// Mapper to transform Airtable record to Event interface
function mapAirtableEvent(record: any): Event {
    const dateValue = record.date;
    const dateObj = new Date(dateValue);
    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // Handle speakers
    let speakers: Speaker[] = [];
    try {
        const speakersVal = record.speakers;
        if (typeof speakersVal === "string") {
            speakers = JSON.parse(speakersVal);
        } else if (Array.isArray(speakersVal)) {
            speakers = speakersVal;
        }
    } catch (e) {
        console.warn("Failed to parse speakers for event:", record.id);
    }

    // Handle form fields
    let formFields: FormField[] = [];
    try {
        const fieldsVal = record.formFields;
        if (typeof fieldsVal === "string") {
            formFields = JSON.parse(fieldsVal);
        } else if (Array.isArray(fieldsVal)) {
            formFields = fieldsVal;
        }
    } catch (e) {
        console.warn("Failed to parse formFields for event:", record.id);
    }

    // Handle learning points
    let learningPoints: string[] = [];
    try {
        const lpVal = record.learningPoints;
        if (typeof lpVal === "string") {
            learningPoints = lpVal.split(/\n|,/).map(p => p.trim()).filter(p => p);
        } else if (Array.isArray(lpVal)) {
            learningPoints = lpVal;
        }
    } catch (e) {
        console.warn("Failed to parse learning points for event:", record.id);
    }

    return {
        id: record.id,
        slug: record.slug,
        title: record.title,
        description: record.description || "",
        shortDescription: record.shortDescription || "",
        date: dateValue,
        displayDate,
        time: `${time} WAT`,
        location: record.location || "Online",
        image: getAirtableImage(record.image) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        tags: record.tags ? (typeof record.tags === 'string' ? record.tags.split(',') : record.tags) : ["Masterclass"],
        status: record.status || "upcoming",
        speakers,
        formFields,
        learningPoints,
        seoImage: getAirtableImage(record.seoImage),
        seoDescription: record.seoDescription
    };
}

export async function getUpcomingEvents(): Promise<Event[]> {
    const records = await queryAirtable("tblbv7qDvZjkWz298", {
        sort: [{ field: "date", direction: "asc" }],
    });

    const now = new Date();

    return records
        .map(mapAirtableEvent)
        .filter(event => {
            const eventDate = new Date(event.date);
            // Show events that are today or in the future
            const isFutureOrToday = eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return isFutureOrToday && event.status !== "past";
        });
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
    const records = await queryAirtable("tblbv7qDvZjkWz298");

    const record = records.find((r: any) => r.slug === slug);
    if (!record) return undefined;

    return mapAirtableEvent(record);
}
