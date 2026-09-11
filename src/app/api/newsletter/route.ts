import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const newsletterSchema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  if (!sql) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  try {
    const formData = await request.formData();
    const { email } = newsletterSchema.parse({ email: formData.get("email") });
    const existing = await sql`SELECT id FROM submissions WHERE type = 'newsletter' AND lower(email) = ${email.toLowerCase()} LIMIT 1`;
    if (existing.length === 0) await sql`
      INSERT INTO submissions (type, email, name, data)
      VALUES ('newsletter', ${email.toLowerCase()}, 'Newsletter subscriber', ${JSON.stringify({ source: "footer" })})
    `;
    return NextResponse.redirect(new URL("/?newsletter=success", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/?newsletter=error", request.url), 303);
  }
}
