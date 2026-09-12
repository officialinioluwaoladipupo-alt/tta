import { queryContent, getImageUrl } from "./content-data";

export async function getGlobalSettings() {
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
    defaultSeoImage: undefined,
  };
}

export async function getAllPrograms() {
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

  return records.map((record: any) => ({
    slug: record.fldposSLgP7UKY3oU,
    title: record.fldJGpX7Oj9ElKfAi,
    label: record.fldtOunVPReRnvVGz,
    status: record.fldger01xzPMYfiZh,
    featured: record.fldkKaRGFxoAhK2j6,
    description: record.fldYzRVAc6wWZayWE,
    image: getImageUrl(record.fldmfK9ySWvpVCPE8),
    seoTitle: record.fldfEd5BB5ShohfnS,
    seoDescription: record.fldB2tqhZErMqcTUr,
    seoImage: getImageUrl(record.fldg9Eg7AHrksMmMp)
  }));
}

export async function getProgramBySlug(slug: string) {
  const records = await queryContent("programs", {
    returnFieldsByFieldId: true
  });

  const record = records.find((r: any) => r.fldposSLgP7UKY3oU === slug);
  if (!record) return null;

  return {
    slug: record.fldposSLgP7UKY3oU,
    title: record.fldJGpX7Oj9ElKfAi,
    label: record.fldtOunVPReRnvVGz,
    status: record.fldger01xzPMYfiZh,
    featured: record.fldkKaRGFxoAhK2j6,
    description: record.fldYzRVAc6wWZayWE,
    content: record.fldtM2lAoLIlotb5H,
    image: getImageUrl(record.fldmfK9ySWvpVCPE8),
    seoTitle: record.fldfEd5BB5ShohfnS,
    seoDescription: record.fldB2tqhZErMqcTUr,
    seoImage: getImageUrl(record.fldg9Eg7AHrksMmMp)
  };
}
