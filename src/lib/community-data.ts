import { queryAirtable, getAirtableImage } from "./airtable";

export interface CommunityHighlight {
    id: string;
    text: string;
    type: "speaker" | "news" | "recap";
    link?: string;
    image?: string;
    isActive: boolean;
    expiryDate?: string;
}

export async function getCommunityHighlights(): Promise<CommunityHighlight[]> {
    const records = await queryAirtable("tblA6otl7k9GEIKzr", {
        returnFieldsByFieldId: true
    });

    if (!records) {
        return [];
    }

    return records
        .map((record: any) => ({
            id: record.id,
            text: record.fldgZo63Sh0FIouxr,
            type: record.fldhj9z8zUncd2WHt,
            link: record.fldwUq6RZ8GORfYEU,
            isActive: record.fldm41s0glSxCrw4Z === true, // Checkboxes return bool in JSON mode
            expiryDate: record.fldj7sHOsPwLXNAzE,
            image: getAirtableImage(record.fld7Bc63XfnJ2rtNV) || undefined
        }))
        .filter(highlight => highlight.isActive);
}
