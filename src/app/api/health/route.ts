import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  if (!sql) return NextResponse.json({ status: "fail" }, { status: 503 });
  try {
    await sql`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "fail" }, { status: 503 });
  }
}
