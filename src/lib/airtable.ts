import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    console.warn("Airtable API Key or Base ID is missing. Please check your .env.local file.");
}

const base = new Airtable({ apiKey }).base(baseId || "");

export async function queryAirtable(tableName: string, options: {
    filterByFormula?: string;
    sort?: { field: string; direction: "asc" | "desc" }[];
    returnFieldsByFieldId?: boolean;
} = {}): Promise<any[]> {
    if (!apiKey || !baseId) return [];

    try {
        const queryOptions: any = {};

        if (options.returnFieldsByFieldId !== undefined) {
            queryOptions.returnFieldsByFieldId = options.returnFieldsByFieldId;
        }

        if (options.filterByFormula) {
            queryOptions.filterByFormula = options.filterByFormula;
        }

        if (options.sort && options.sort.length > 0) {
            queryOptions.sort = options.sort;
        }

        const records = await base(tableName).select(queryOptions).all();

        return records.map(record => ({
            id: record.id,
            ...record.fields,
        }));
    } catch (error) {
        console.error(`Error querying Airtable table "${tableName}":`, error);
        return [];
    }
}

export function getAirtableImage(field: any): string | undefined {
    if (Array.isArray(field) && field.length > 0) {
        return field[0].url;
    }
    return undefined;
}
