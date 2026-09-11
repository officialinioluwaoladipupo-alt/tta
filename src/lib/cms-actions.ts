"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { EventFormData, HighlightFormData } from "./cms-types";
import { sql } from "./db";
import { auth0 } from "./auth0";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().trim().min(1).max(200), slug: z.string().trim().regex(/^[a-z0-9-]+$/),
  description: z.string().max(10000), startDate: z.string().min(1), location: z.string().max(200).optional(),
  link: z.string().url().optional().or(z.literal("")), tags: z.union([z.string().max(500), z.array(z.string())]).optional(),
  image: z.string().url().optional(), shortDescription: z.string().max(1000).optional(), speakers: z.string().max(10000).optional(), learningPoints: z.string().max(5000).optional(),
});
const highlightSchema = z.object({ text: z.string().trim().min(1).max(2000), type: z.enum(["news", "speaker", "recap"]), link: z.string().url().optional().or(z.literal("")), isActive: z.union([z.boolean(), z.literal("on")]).optional(), image: z.string().url().optional() });
const settingsSchema = z.object({ siteName: z.string().trim().min(1).max(120), siteDescription: z.string().max(500), marqueeText: z.string().trim().min(1).max(2000), footerMarqueeText: z.string().trim().min(1).max(200), defaultSeoImage: z.string().url().optional().or(z.literal("")), teamMembers: z.string().max(20000).optional() });

async function requireEditor() {
  const session = await auth0.getSession();
  if (!session) throw new Error("Unauthorized");
  const allowed = (process.env.AUTH0_ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const email = typeof session.user?.email === "string" ? session.user.email.toLowerCase() : "";
  if (allowed.length === 0 || !allowed.includes(email)) throw new Error("Forbidden");
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

export async function updateSettings(data: unknown) {
  await requireEditor();
  if (!sql) return { success: false, error: "Database is not configured" };
  const settings = settingsSchema.parse(data);
  const existing = await sql`SELECT id FROM settings ORDER BY created_at DESC LIMIT 1`;
  if (existing.length > 0) await sql`UPDATE settings SET data = ${JSON.stringify(settings)} WHERE id = ${existing[0].id}`;
  else await sql`INSERT INTO settings (data) VALUES (${JSON.stringify(settings)})`;
  revalidatePath("/"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function createEvent(data: EventFormData) { await requireEditor(); return saveContent("events", eventSchema.parse(data), ["/events", "/dashboard"]); }
export async function createHighlight(data: HighlightFormData) { await requireEditor(); return saveContent("highlights", highlightSchema.parse(data), ["/", "/dashboard"]); }
async function saveContent(table: "events" | "highlights", data: unknown, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`INSERT INTO ${sql.unsafe(table)} (data) VALUES (${JSON.stringify(data)})`;
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}
export async function updateEvent(id: string, data: EventFormData) { await requireEditor(); return updateContent("events", id, eventSchema.parse(data), ["/events", "/dashboard"]); }
export async function updateHighlight(id: string, data: HighlightFormData) { await requireEditor(); return updateContent("highlights", id, highlightSchema.parse(data), ["/", "/dashboard"]); }
async function updateContent(table: "events" | "highlights", id: string, data: unknown, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`UPDATE ${sql.unsafe(table)} SET data = ${JSON.stringify(data)} WHERE id = ${id}`;
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}
export async function deleteEvent(id: string) { await requireEditor(); return deleteContent("events", id, ["/events", "/dashboard"]); }
export async function deleteHighlight(id: string) { await requireEditor(); return deleteContent("highlights", id, ["/", "/dashboard"]); }
async function deleteContent(table: "events" | "highlights", id: string, paths: string[]) {
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`DELETE FROM ${sql.unsafe(table)} WHERE id = ${id}`;
  paths.forEach((path) => revalidatePath(path));
  return { success: true, error: undefined };
}

export async function uploadImage(fileData: string, fileName: string) {
  await requireEditor();
  if (!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(fileData) || fileData.length > 8_000_000) return { success: false, error: "Invalid or oversized image", url: undefined };
  if (!configureCloudinary()) return { success: false, error: "Cloudinary is not configured", url: undefined };
  try {
    const result = await cloudinary.uploader.upload(fileData, { folder: "tta", public_id: fileName.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80), resource_type: "image" });
    return { success: true, url: result.secure_url, error: undefined };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Upload failed", url: undefined };
  }
}

export async function createTeamMember(data: { name: string; role: string; bio?: string; photoUrl?: string; sortOrder?: number; isVisible?: boolean }) {
  await requireEditor();
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`INSERT INTO team_members (name, role, bio, photo_url, sort_order, is_visible) VALUES (${data.name.trim()}, ${data.role.trim()}, ${data.bio || ""}, ${data.photoUrl || null}, ${data.sortOrder || 0}, ${data.isVisible ?? true})`;
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function updateTeamMember(id: string, data: { name: string; role: string; bio?: string; photoUrl?: string; sortOrder?: number; isVisible?: boolean }) {
  await requireEditor();
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`UPDATE team_members SET name=${data.name.trim()}, role=${data.role.trim()}, bio=${data.bio || ""}, photo_url=${data.photoUrl || null}, sort_order=${data.sortOrder || 0}, is_visible=${data.isVisible ?? true}, updated_at=now() WHERE id=${id}`;
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function deleteTeamMember(id: string) {
  await requireEditor();
  if (!sql) return { success: false, error: "Database is not configured" };
  await sql`DELETE FROM team_members WHERE id=${id}`;
  revalidatePath("/about"); revalidatePath("/dashboard");
  return { success: true, error: undefined };
}
