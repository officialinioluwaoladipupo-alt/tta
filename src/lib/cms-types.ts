export type FieldSet = Record<string, unknown>;
export interface ContentAttachment { url: string; [key: string]: unknown; }

export interface EventFields extends FieldSet {
    fld60g2Jlm4glr70e?: string; // Title
    fldfuCZ1yt5Hk0DZp?: string; // Slug
    flddPxpiutxYsuYzL?: string; // Description
    fldnqKLlla00mhERq?: string; // Start Date
    fldCCH17B42hKfQM9?: string; // Location
    fld6Azz8y9qUZAXSx?: string; // Link
    fldEA33iR5rPpAEBG?: string; // Status (e.g., "upcoming")
    fld3vQXMLYCgvuiYT?: string[]; // Tags
    fldC3VHA5QJfiLh9W?: ContentAttachment[]; // Image
    fldfWdfSuxHY7iSbA?: string; // Short Description
    fld61jNMCFHDGQ2Nq?: string; // Speakers (JSON string)
    fldLearningPoints?: string; // Learning Points
}

export interface HighlightFields extends FieldSet {
    fldgZo63Sh0FIouxr?: string; // Text
    fldhj9z8zUncd2WHt?: string; // Type (news, speaker, recap)
    fldwUq6RZ8GORfYEU?: string; // Link
    fldm41s0glSxCrw4Z?: boolean; // Active/Visible
    fld7Bc63XfnJ2rtNV?: ContentAttachment[]; // Image
}

export type ContentRecord<T extends FieldSet> = T & {
    id: string;
    createdTime?: string;
};

export interface EventFormData {
    title: string;
    slug: string;
    description: string;
    startDate: string;
    location?: string;
    link?: string;
    tags?: string | string[];
    image?: string;
    shortDescription?: string;
    speakers?: string;
    learningPoints?: string;
}

export interface HighlightFormData {
    text: string;
    type: string;
    link?: string;
    isActive?: string | boolean; // 'on' from form or boolean from code
    image?: string;
}
