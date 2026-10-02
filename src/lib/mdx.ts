import { queryContent, getImageUrl, contentString, type ContentRecord } from "./content-data";

export interface ProgramData {
  slug: string;
  title: string;
  label: string;
  status: string;
  featured: boolean;
  description: string;
  content?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  marqueeText: string;
  footerMarqueeText: string;
  defaultSeoImage?: string;
  showHeaderMarquee?: boolean;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const settings = await queryContent("Settings", {
      returnFieldsByFieldId: true
    });

    if (settings && settings.length > 0) {
      const s = settings[0];
      return {
        siteName: (s.siteName || s.fldJHiVrjfL3BeX4E) as string,
        siteDescription: (s.siteDescription || s.fldmQGL4x54GUT8sB) as string,
        marqueeText: (s.marqueeText || s.fldzwzjC7K5TwNIq7) as string,
        footerMarqueeText: (s.footerMarqueeText || s.siteName || "TTA") as string,
        defaultSeoImage: getImageUrl(s.defaultSeoImage || s.fldrq35F3RQmlo9E6)
      };
    }
  } catch {
    console.warn("[Content] Failed to fetch global settings");
  }
  return {
    siteName: "The Thinking Architect",
    siteDescription: "An authority signal and gateway to TTA platforms. Calm, Intentional, Durable.",
    marqueeText: "THE THINKING ARCHITECT",
    footerMarqueeText: "THE THINKING ARCHITECT",
    defaultSeoImage: undefined,
  };
}

function mapProgram(record: ContentRecord): ProgramData {
  return {
    slug: contentString(record, "fldposSLgP7UKY3oU") ?? record.id,
    title: contentString(record, "fldJGpX7Oj9ElKfAi") ?? "Untitled program",
    label: contentString(record, "fldtOunVPReRnvVGz") ?? "Program",
    status: contentString(record, "fldger01xzPMYfiZh") ?? "active",
    featured: record.fldkKaRGFxoAhK2j6 === true,
    description: contentString(record, "fldYzRVAc6wWZayWE") ?? "",
    content: contentString(record, "fldtM2lAoLIlotb5H"),
    image: getImageUrl(record.fldmfK9ySWvpVCPE8),
    seoTitle: contentString(record, "fldfEd5BB5ShohfnS"),
    seoDescription: contentString(record, "fldB2tqhZErMqcTUr"),
    seoImage: getImageUrl(record.fldg9Eg7AHrksMmMp),
  };
}

export async function getAllPrograms(): Promise<ProgramData[]> {
  const records = await queryContent("programs", {
    sort: [{ field: "fldJGpX7Oj9ElKfAi", direction: "asc" }], // Sort by Title ID
    returnFieldsByFieldId: true
  });

  if (records.length === 0) return [{
    slug: "locked-in-2026",
    title: "Locked-IN 2026",
    label: "Program",
    status: "active",
    featured: true,
    description: "A structured program for architects navigating the transition from education to practice.",
  }];

  return records.map(mapProgram);
}

export async function getProgramBySlug(slug: string): Promise<ProgramData | null> {
  const records = await queryContent("programs", {
    returnFieldsByFieldId: true
  });

  const record = records.find((item) => item.fldposSLgP7UKY3oU === slug);
  if (!record) return null;
  return mapProgram(record);
}
