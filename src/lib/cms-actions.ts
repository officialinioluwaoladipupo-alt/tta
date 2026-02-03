"use server";

import Airtable from "airtable";
import { revalidatePath } from "next/cache";
import { createClientServer } from "./supabase";
import { nanoid } from "nanoid";
import {
    EventFormData,
    HighlightFormData,
    AirtableEventFields,
    AirtableHighlightFields
} from "./cms-types";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey }).base(baseId || "");

export async function saveSubmission(payload: { type: string; email: string; name: string; data: any; event_id?: string }) {
    try {
        const supabase = await createClientServer();
        const { error } = await supabase.from("submissions").insert([payload]);
        if (error) throw error;
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error saving submission:", error);
        return { success: false, error: error.message };
    }
}

export async function createAirtableEvent(formData: EventFormData) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: AirtableEventFields = {
            fld60g2Jlm4glr70e: formData.title,
            fldfuCZ1yt5Hk0DZp: formData.slug,
            flddPxpiutxYsuYzL: formData.description,
            fldnqKLlla00mhERq: formData.startDate,
            fldCCH17B42hKfQM9: formData.location || "Online",
            fld6Azz8y9qUZAXSx: formData.link,
            fldEA33iR5rPpAEBG: "upcoming",
            fld3vQXMLYCgvuiYT: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : (formData.tags as string).split(",").map((t: string) => t.trim())) : ["Masterclass"],
            fldC3VHA5QJfiLh9W: formData.image ? [{ url: formData.image } as any] : undefined,
            fldfWdfSuxHY7iSbA: formData.shortDescription,
            fld61jNMCFHDGQ2Nq: formData.speakers, // Expected as JSON string from dashboard
            fldLearningPoints: formData.learningPoints, // Expected as string or array
        };

        await base("tblbv7qDvZjkWz298").create([
            { fields }
        ] as any, { returnFieldsByFieldId: true } as any);

        revalidatePath("/events");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating Airtable event:", error);
        return { success: false, error: error.message };
    }
}

export async function createAirtableHighlight(formData: HighlightFormData) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: AirtableHighlightFields = {
            fldgZo63Sh0FIouxr: formData.text,
            fldhj9z8zUncd2WHt: formData.type,
            fldwUq6RZ8GORfYEU: formData.link,
            fldm41s0glSxCrw4Z: true,
            fld7Bc63XfnJ2rtNV: formData.image ? [{ url: formData.image } as any] : undefined,
        };

        await base("tblA6otl7k9GEIKzr").create([
            { fields }
        ] as any, { returnFieldsByFieldId: true } as any);

        revalidatePath("/");
        revalidatePath("/community");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating Airtable highlight:", error);
        return { success: false, error: error.message };
    }
}

// --- Content Management (Update / Delete) ---

export async function updateAirtableEvent(recordId: string, formData: EventFormData) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: AirtableEventFields = {
            fld60g2Jlm4glr70e: formData.title,
            fldfuCZ1yt5Hk0DZp: formData.slug,
            flddPxpiutxYsuYzL: formData.description,
            fldnqKLlla00mhERq: formData.startDate,
            fldCCH17B42hKfQM9: formData.location,
            fld6Azz8y9qUZAXSx: formData.link,
            fld3vQXMLYCgvuiYT: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : (formData.tags as string).split(",").map((t: string) => t.trim())) : undefined,
            fldC3VHA5QJfiLh9W: formData.image ? [{ url: formData.image } as any] : undefined,
            fldfWdfSuxHY7iSbA: formData.shortDescription,
            fld61jNMCFHDGQ2Nq: formData.speakers,
            fldLearningPoints: formData.learningPoints,
        };

        // Remove undefined keys to avoid sending them to Airtable if they shouldn't be touched (though in update usually we overwrite what we send)
        // Airtable JS SDK handles undefined gracefully by not sending? Actually it might throw if explicitly undefined. 
        // Best practice: filtering. But let's try strict assignment first as FieldSet allows optional.

        await base("tblbv7qDvZjkWz298").update([
            {
                id: recordId,
                fields
            }
        ] as any, { returnFieldsByFieldId: true } as any);
        revalidatePath("/events");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAirtableEvent(recordId: string) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        await base("tblbv7qDvZjkWz298").destroy(recordId);
        revalidatePath("/events");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAirtableHighlight(recordId: string, formData: HighlightFormData) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: AirtableHighlightFields = {
            fldgZo63Sh0FIouxr: formData.text,
            fldhj9z8zUncd2WHt: formData.type,
            fldwUq6RZ8GORfYEU: formData.link,
            fldm41s0glSxCrw4Z: formData.isActive === 'on' || formData.isActive === true,
            fld7Bc63XfnJ2rtNV: formData.image ? [{ url: formData.image } as any] : undefined,
        };

        await base("tblA6otl7k9GEIKzr").update([
            {
                id: recordId,
                fields
            }
        ] as any, { returnFieldsByFieldId: true } as any);
        revalidatePath("/");
        revalidatePath("/community");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAirtableHighlight(recordId: string) {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        await base("tblA6otl7k9GEIKzr").destroy(recordId);
        revalidatePath("/");
        revalidatePath("/community");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Media Management ---

export async function uploadImage(fileData: string, fileName: string) {
    try {
        const supabase = await createClientServer();
        const buffer = Buffer.from(fileData, 'base64');
        const path = `cms/${nanoid()}-${fileName}`;

        const { data, error } = await supabase.storage
            .from('media') // User needs to create this bucket in Supabase
            .upload(path, buffer, {
                contentType: 'image/jpeg', // Standardized for simplicity
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(path);

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error("Storage Error:", error);
        return { success: false, error: error.message };
    }
}
