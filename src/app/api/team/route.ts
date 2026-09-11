import { NextResponse } from "next/server";
import { getTeamMembers } from "@/lib/team-data";

export async function GET() {
  return NextResponse.json(await getTeamMembers(), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
