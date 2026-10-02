import { requirePermission } from "@/lib/authorization";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team Preview", robots: { index: false, follow: false } };

export default async function TeamPreviewPage({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  await requirePermission("edit:media", "page");
  const value = (await searchParams).data;
  let member: { name?: string; role?: string; bio?: string; photoUrl?: string };
  try { member = value ? JSON.parse(value) : {}; } catch { notFound(); }
  return <main className="min-h-screen bg-background pt-32 pb-20 px-6"><div className="max-w-4xl mx-auto"><div className="border-2 border-accent bg-accent/10 text-accent p-4 mb-10 font-black uppercase tracking-widest">Preview · Unsaved team profile</div><article className="border border-foreground/10 p-8 max-w-md"><div className="aspect-square bg-foreground/5 mb-6 overflow-hidden relative">{member.photoUrl ? <Image src={member.photoUrl} alt={member.name || "Team member"} fill sizes="400px" className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-7xl font-black">{member.name?.[0] || "?"}</span>}</div><h1 className="text-3xl font-black uppercase">{member.name || "Unnamed team member"}</h1><p className="text-accent text-xs font-bold uppercase tracking-widest mt-2">{member.role}</p><p className="text-foreground/60 mt-4">{member.bio}</p></article></div></main>;
}
