import { queryAirtable, getAirtableImage } from "./airtable";

export async function getGlobalSettings() {
  try {
    const settings = await queryAirtable("Settings", {
      returnFieldsByFieldId: true
    });

    if (settings && settings.length > 0) {
      const s = settings[0];
      return {
        siteName: s.fldJHiVrjfL3BeX4E as string,
        siteDescription: s.fldmQGL4x54GUT8sB as string,
        marqueeText: s.fldzwzjC7K5TwNIq7 as string,
        defaultSeoImage: getAirtableImage(s.fldrq35F3RQmlo9E6)
      };
    }
  } catch (error) {
    console.warn("[Airtable] Failed to fetch global settings");
  }
  return null;
}

export async function getAllPrograms() {
  const records = await queryAirtable("tblHShOUifU1m6EkS", {
    sort: [{ field: "fldJGpX7Oj9ElKfAi", direction: "asc" }], // Sort by Title ID
    returnFieldsByFieldId: true
  });

  return records.map((record: any) => ({
    slug: record.fldposSLgP7UKY3oU,
    title: record.fldJGpX7Oj9ElKfAi,
    label: record.fldtOunVPReRnvVGz,
    status: record.fldger01xzPMYfiZh,
    featured: record.fldkKaRGFxoAhK2j6,
    description: record.fldYzRVAc6wWZayWE,
    image: getAirtableImage(record.fldmfK9ySWvpVCPE8),
    seoTitle: record.fldfEd5BB5ShohfnS,
    seoDescription: record.fldB2tqhZErMqcTUr,
    seoImage: getAirtableImage(record.fldg9Eg7AHrksMmMp)
  }));
}

export async function getProgramBySlug(slug: string) {
  const records = await queryAirtable("tblHShOUifU1m6EkS", {
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
    image: getAirtableImage(record.fldmfK9ySWvpVCPE8),
    seoTitle: record.fldfEd5BB5ShohfnS,
    seoDescription: record.fldB2tqhZErMqcTUr,
    seoImage: getAirtableImage(record.fldg9Eg7AHrksMmMp)
  };
}
