import { requirePermission } from "@/lib/authorization";
import { sql } from "@/lib/db";
import TeamAdmin from "./TeamAdmin";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  await requirePermission("read:dashboard", "page");
  await requirePermission("manage:team");
  const members = sql ? await sql`SELECT id, name, role, bio, photo_url AS "photoUrl", photo_public_id AS "photoPublicId", sort_order AS "sortOrder", is_visible AS "isVisible" FROM team_members ORDER BY sort_order ASC, created_at ASC` : [];
  return <TeamAdmin initialMembers={members as never[]} />;
}
