import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import TeamAdmin from "./TeamAdmin";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  if (!(await auth0.getSession())) redirect("/auth/login");
  const members = sql ? await sql`SELECT id, name, role, bio, photo_url AS "photoUrl", sort_order AS "sortOrder", is_visible AS "isVisible" FROM team_members ORDER BY sort_order ASC, created_at ASC` : [];
  return <TeamAdmin initialMembers={members as never[]} />;
}
