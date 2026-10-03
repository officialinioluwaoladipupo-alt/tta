import sharp from "sharp";

export async function validateImageMetadata(
  meta: { format?: string; width?: number; height?: number; size?: number },
  entity: "event" | "team" | "speaker" | "highlight" | "content" = "content",
) {
  if (!meta.format || !["jpeg", "jpg", "png", "webp"].includes(meta.format.toLowerCase())) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }
  if (typeof meta.size !== "number" || meta.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Image must be 5 MB or smaller" };
  }
  const min = entity === "team" ? 400 : entity === "speaker" ? 300 : 800;
  if (!meta.width || !meta.height) return { valid: false, error: "The image file is corrupt or unreadable" };
  if (meta.width < min || meta.height < min) return { valid: false, error: `Image must be at least ${min}×${min}px` };
  if (meta.width > 4000 || meta.height > 4000) return { valid: false, error: "Image must be no larger than 4000×4000px" };
  return { valid: true, error: undefined, width: meta.width, height: meta.height, size: meta.size };
}

export async function validateImageData(fileData: string, entity: "event" | "team" | "speaker" | "highlight" | "content" = "content") {
  const match = fileData.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  const buffer = Buffer.from(match[2], "base64");
  try {
    const meta = await sharp(buffer).metadata();
    return validateImageMetadata({ ...meta, size: buffer.length }, entity);
  } catch {
    return { valid: false, error: "The image file is corrupt or unreadable" };
  }
}
