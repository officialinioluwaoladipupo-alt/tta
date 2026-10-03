"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import { EventFormData, HighlightFormData } from "./cms-types";
import { sql } from "./db";
import { requirePermission } from "./authorization";
import { z } from "zod";
import { getSubmissions, submissionsToCsv, type SubmissionFilters } from "./submission-data";
import { validateImageMetadata } from "./image-validation";
import { logAudit } from "./audit";
import { destroyCloudinaryAsset } from "./cloudinary-cleanup";

const eventSchema = z.object({
  title: z.string().trim().min(1).max(200), slug: z.string().trim().regex(/^[a-z0-9-]+$/),
  description: z.string().max(10000), startDate: z.string().min(1), location: z.string().max(200).optional(),
  link: z.string().url().optional().or(z.literal("")), tags: z.union([z.string().max(500), z.array(z.string())]).optional(),
  image: z.string().url().optional(), imagePublicId: z.string().max(255).optional(), shortDescription: z.string().max(1000).optional(), speakers: z.string().max(10000).optional(), learningPoints: z.string().max(5000).optional(),
  sessionNumber: z.string().trim().max(30).optional(), format: z.string().trim().max(100).optional(),
  recordingUrl: z.string().url().optional().or(z.literal("")), resources: z.string().max(10000).optional(), sessionNotes: z.string().max(10000).optional(),
});
const highlightSchema = z.object({ text: z.string().trim().min(1).max(2000), type: z.enum(["news", "speaker", "recap"]), link: z.string().url().optional().or(z.literal("")), isActive: z.union([z.boolean(), z.literal("on")]).optional(), image: z.string().url().optional(), imagePublicId: z.string().max(255).optional() });
const settingsSchema = z.object({ siteName: z.string().trim().min(1).max(120), siteDescription: z.string().max(500), marqueeText: z.string().trim().min(1).max(2000), footerMarqueeText: z.string().trim().min(1).max(200), defaultSeoImage: z.string().url().optional().or(z.literal("")), teamMembers: z.string().max(20000).optional() });
const imageEntitySchema = z.enum(["event", "team", "speaker", "highlight", "content"]);

function validationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Check the form fields and try again.";
  if (issue.path[0] === "link" || issue.path[0] === "recordingUrl") {
    return "Enter a complete URL starting with https://, or leave the link field blank.";
  }
  return "Some information is missing or invalid. Check the form fields and try again.";
}

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return false;
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
  return true;
}

export async function saveSubmission(payload: { type: string; email: string; name: string; data: unknown; event_id?: string }) {
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`INSERT INTO submissions (type, email, name, data, event_id) VALUES (${payload.type}, ${payload.email}, ${payload.name}, ${JSON.stringify(payload.data)}, ${payload.event_id ?? null})`;
  revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function exportSubmissionsCsv(filters: SubmissionFilters) {
  await requirePermission("export:data");
  if (!sql) return { success: false, error: "Database is not configured", csv: undefined };
  const result = await getSubmissions(filters, 1, 10000);
  if (result.error) return { success: false, error: result.error, csv: undefined };
  await logAudit({ action: "export", contentType: "submissions", changes: { count: result.rows.length, filters } });
  return { success: true, error: undefined, csv: submissionsToCsv(result.rows) };
}

export async function deleteSubmission(id: string, label: string) {
  await requirePermission("delete:content");
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`DELETE FROM submissions WHERE id = ${id}`;
  await logAudit({ action: "delete", contentType: "submissions", recordId: id, changes: { deleted: { before: false, after: true } } });
  revalidatePath("/dashboard");
  return { success: true, error: undefined, label };
}

export async function updateSettings(data: unknown) {
  await requirePermission("manage:settings");
  if (!sql) return { success: false, error: "Database is not configured" };
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: validationMessage(parsed.error) };
  const settings = parsed.data;
  const existing = await sql`SELECT id FROM settings ORDER BY created_at DESC LIMIT 1`;
  if (existing.length > 0) {
    const before = (await sql`SELECT data FROM settings WHERE id = ${existing[0].id}`)[0]?.data;
    await sql`UPDATE settings SET data = ${JSON.stringify(settings)} WHERE id = ${existing[0].id}`;
    await logAudit({ action: "update", contentType: "settings", recordId: String(existing[0].id), changes: { data: { before, after: settings } } });
  } else {
    const inserted = await sql`INSERT INTO settings (data) VALUES (${JSON.stringify(settings)}) RETURNING id`;
    await logAudit({ action: "create", contentType: "settings", recordId: String(inserted[0]?.id || ""), changes: { data: { before: null, after: settings } } });
  }
  revalidatePath("/"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function createEvent(data: EventFormData) {
  await requirePermission("edit:events");
  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: validationMessage(parsed.error) };
  return saveContent("events", parsed.data, ["/", "/events", "/dashboard"]);
}
export async function createHighlight(data: HighlightFormData) {
  await requirePermission("edit:highlights");
  const parsed = highlightSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: validationMessage(parsed.error) };
  return saveContent("highlights", parsed.data, ["/", "/dashboard"]);
}
async function saveContent(table: "events" | "highlights", data: unknown, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  const inserted = await sql`INSERT INTO ${sql.unsafe(table)} (data) VALUES (${JSON.stringify(data)}) RETURNING id`;
  await logAudit({ action: "create", contentType: table, recordId: String(inserted[0]?.id || ""), changes: { data: { before: null, after: data } } });
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}
export async function updateEvent(id: string, data: EventFormData) {
  await requirePermission("edit:events");
  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: validationMessage(parsed.error) };
  return updateContent("events", id, parsed.data, ["/", "/events", "/dashboard"]);
}
export async function updateHighlight(id: string, data: HighlightFormData) {
  await requirePermission("edit:highlights");
  const parsed = highlightSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: validationMessage(parsed.error) };
  return updateContent("highlights", id, parsed.data, ["/", "/dashboard"]);
}
async function updateContent(table: "events" | "highlights", id: string, data: unknown, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  const before = (await sql`SELECT data FROM ${sql.unsafe(table)} WHERE id = ${id}`)[0]?.data;
  await sql`UPDATE ${sql.unsafe(table)} SET data = ${JSON.stringify(data)} WHERE id = ${id}`;
  await logAudit({ action: "update", contentType: table, recordId: id, changes: { data: { before, after: data } } });
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}
export async function deleteEvent(id: string) { await requirePermission("delete:content"); return deleteContent("events", id, ["/events", "/dashboard"]); }
export async function deleteHighlight(id: string) { await requirePermission("delete:content"); return deleteContent("highlights", id, ["/", "/dashboard"]); }
async function deleteContent(table: "events" | "highlights", id: string, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  const existing = (await sql`SELECT data FROM ${sql.unsafe(table)} WHERE id = ${id}`)[0]?.data as Record<string, unknown> | undefined;
  await sql`DELETE FROM ${sql.unsafe(table)} WHERE id = ${id}`;
  const ids = [existing?.imagePublicId, ...(Array.isArray(existing?.speakers) ? existing?.speakers.map((speaker) => (speaker as Record<string, unknown>).publicId) : [])].filter((value): value is string => typeof value === "string");
  for (const publicId of [...new Set(ids)]) await destroyCloudinaryAsset(publicId);
  await logAudit({ action: "delete", contentType: table, recordId: id, changes: { deleted: { before: false, after: true } } });
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}

export async function createImageUploadSignature(fileName: string, entityType: "event" | "team" | "speaker" | "highlight" | "content" = "content") {
  await requirePermission("edit:media");
  const parsedEntity = imageEntitySchema.safeParse(entityType);
  if (!parsedEntity.success) return { success: false as const, error: "Invalid image category" };
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return { success: false as const, error: "Cloudinary is not configured" };
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const folder = `tta/${parsedEntity.data}`;
  const safeName = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 60) || "image";
  const uploadPublicId = `${safeName}-${randomUUID()}`;
  const publicId = `${folder}/${uploadPublicId}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const allowedFormats = "jpg,png,webp";
  const params = { allowed_formats: allowedFormats, folder, overwrite: false, public_id: uploadPublicId, timestamp };
  return {
    success: true as const,
    cloudName,
    apiKey,
    timestamp,
    folder,
    publicId,
    uploadPublicId,
    allowedFormats,
    overwrite: false,
    signature: cloudinary.utils.api_sign_request(params, apiSecret),
  };
}

export async function completeImageUpload(publicId: string, fileName: string, entityType: "event" | "team" | "speaker" | "highlight" | "content" = "content") {
  await requirePermission("edit:media");
  const parsedEntity = imageEntitySchema.safeParse(entityType);
  if (!parsedEntity.success || typeof publicId !== "string" || !publicId.startsWith(`tta/${entityType}/`)) {
    return { success: false as const, error: "The uploaded image could not be verified." };
  }
  if (!configureCloudinary()) return { success: false as const, error: "Cloudinary is not configured" };

  try {
    const asset = await cloudinary.api.resource(publicId, { resource_type: "image" });
    const validation = await validateImageMetadata({ format: asset.format, width: asset.width, height: asset.height, size: asset.bytes }, entityType);
    if (!validation.valid) {
      await destroyCloudinaryAsset(publicId);
      return { success: false as const, error: validation.error || "This image could not be accepted." };
    }
    if (!asset.secure_url) {
      await destroyCloudinaryAsset(publicId);
      return { success: false as const, error: "Cloudinary did not return a secure image URL." };
    }
    await logAudit({ action: "create", contentType: `${entityType}_image`, recordId: publicId, changes: { image: { before: null, after: { publicId, url: asset.secure_url, fileName } } } });
    return { success: true as const, url: asset.secure_url, publicId, width: asset.width, height: asset.height, size: asset.bytes };
  } catch {
    await destroyCloudinaryAsset(publicId);
    return { success: false as const, error: "Upload could not be verified. Please retry." };
  }
}

export async function createTeamMember(data: { name: string; role: string; bio?: string; photoUrl?: string; photoPublicId?: string; sortOrder?: number; isVisible?: boolean }) {
  await requirePermission("manage:team");
  if (!sql) return { success: false, error: "Database is not configured" };
  const inserted = await sql`INSERT INTO team_members (name, role, bio, photo_url, photo_public_id, sort_order, is_visible) VALUES (${data.name.trim()}, ${data.role.trim()}, ${data.bio || ""}, ${data.photoUrl || null}, ${data.photoPublicId || null}, ${data.sortOrder || 0}, ${data.isVisible ?? true}) RETURNING id`;
  await logAudit({ action: "create", contentType: "team_members", recordId: String(inserted[0]?.id || ""), changes: { member: { before: null, after: { name: data.name, role: data.role, bio: data.bio || "", photoUrl: data.photoUrl || null, sortOrder: data.sortOrder || 0, isVisible: data.isVisible ?? true } } } });
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function updateTeamMember(id: string, data: { name: string; role: string; bio?: string; photoUrl?: string; photoPublicId?: string; sortOrder?: number; isVisible?: boolean }) {
  await requirePermission("manage:team");
  if (!sql) return { success: false, error: "Database is not configured" };
  const before = (await sql`SELECT name, role, bio, photo_url AS "photoUrl", photo_public_id AS "photoPublicId", sort_order AS "sortOrder", is_visible AS "isVisible" FROM team_members WHERE id=${id}`)[0];
  const photoPublicId = data.photoPublicId || null;
  await sql`UPDATE team_members SET name=${data.name.trim()}, role=${data.role.trim()}, bio=${data.bio || ""}, photo_url=${data.photoUrl || null}, photo_public_id=${photoPublicId}, sort_order=${data.sortOrder || 0}, is_visible=${data.isVisible ?? true}, updated_at=now() WHERE id=${id}`;
  if (before?.photoPublicId && before.photoPublicId !== photoPublicId) await destroyCloudinaryAsset(before.photoPublicId);
  await logAudit({ action: "update", contentType: "team_members", recordId: id, changes: { member: { before, after: { name: data.name, role: data.role, bio: data.bio || "", photoUrl: data.photoUrl || null, sortOrder: data.sortOrder || 0, isVisible: data.isVisible ?? true } } } });
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function deleteTeamMember(id: string) {
  await requirePermission("manage:team");
  await requirePermission("delete:content");
  if (!sql) return { success: false, error: "Database is not configured" };
  const before = (await sql`SELECT photo_public_id FROM team_members WHERE id=${id}`)[0];
  await sql`DELETE FROM team_members WHERE id=${id}`;
  await destroyCloudinaryAsset(before?.photo_public_id);
  await logAudit({ action: "delete", contentType: "team_members", recordId: id, changes: { deleted: { before: false, after: true } } });
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}
