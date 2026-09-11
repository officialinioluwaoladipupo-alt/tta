import { queryContent, getImageUrl } from "./content-data";

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
    const records = await queryContent("highlights", {
        returnFieldsByFieldId: true
    });

    if (!records) {
        return [];
    }

    return records
        .map((record: any) => ({
            id: record.id,
            text: record.text || record.fldgZo63Sh0FIouxr,
            type: record.type || record.fldhj9z8zUncd2WHt,
            link: record.link || record.fldwUq6RZ8GORfYEU,
            isActive: record.isActive ?? record.fldm41s0glSxCrw4Z === true,
            expiryDate: record.expiryDate || record.fldj7sHOsPwLXNAzE,
            image: record.image || getImageUrl(record.fld7Bc63XfnJ2rtNV) || undefined
        }))
        .filter(highlight => highlight.isActive);
}
