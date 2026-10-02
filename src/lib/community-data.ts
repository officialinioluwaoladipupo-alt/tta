import { queryContent, getImageUrl, contentString } from "./content-data";

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
    const records = await queryContent("highlights");
    return records.map<CommunityHighlight>((record) => ({
        id: record.id,
        text: contentString(record, "text", "fldgZo63Sh0FIouxr") ?? "",
        type: (() => {
            const type = contentString(record, "type", "fldhj9z8zUncd2WHt");
            return type === "speaker" ? "speaker" : type === "recap" ? "recap" : "news";
        })(),
        link: contentString(record, "link", "fldwUq6RZ8GORfYEU"),
        isActive: record.isActive === true || record.fldm41s0glSxCrw4Z === true,
        expiryDate: contentString(record, "expiryDate", "fldj7sHOsPwLXNAzE"),
        image: contentString(record, "image") ?? getImageUrl(record.fld7Bc63XfnJ2rtNV),
    })).filter((highlight) => highlight.isActive);
}
