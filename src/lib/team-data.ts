import { sql } from "./db";

export interface TeamMember { id: string; name: string; role: string; bio: string; photoUrl?: string; }

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!sql) return [];
  try {
    return await sql`SELECT id, name, role, bio, photo_url AS "photoUrl" FROM team_members WHERE is_visible = true ORDER BY sort_order ASC, created_at ASC` as TeamMember[];
  } catch (error) {
    console.warn("[Team] Neon read failed", error instanceof Error ? error.message : error);
    return [];
  }
}
