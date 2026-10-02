import Image from "next/image";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/authorization";
import type { Speaker } from "@/lib/event-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Think Session Preview", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ data?: string }> };
type Draft = {
  title?: string;
  startDate?: string;
  location?: string;
  format?: string;
  sessionNumber?: string;
  link?: string;
  recordingUrl?: string;
  sessionNotes?: string;
  resources?: string;
  description?: string;
  shortDescription?: string;
  speakers: Speaker[];
  tags: string[];
};

function parseDraft(value?: string): Draft | null {
  if (!value) return null;
  try {
    const raw = JSON.parse(value) as Record<string, string>;
    const speakers = raw.speakers ? JSON.parse(raw.speakers) as Speaker[] : [];
    return {
      title: raw.title,
      startDate: raw.startDate,
      location: raw.location,
      format: raw.format,
      sessionNumber: raw.sessionNumber,
      link: raw.link,
      recordingUrl: raw.recordingUrl,
      sessionNotes: raw.sessionNotes,
      resources: raw.resources,
      description: raw.description,
      shortDescription: raw.shortDescription,
      speakers,
      tags: raw.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [],
    };
  } catch {
    return null;
  }
}

export default async function EventPreviewPage({ searchParams }: Props) {
  await requirePermission("edit:events", "page");
  const draft = parseDraft((await searchParams).data);
  if (!draft) notFound();

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-28 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 border-2 border-accent bg-accent/10 p-4 font-black uppercase tracking-widest text-accent">Preview · Unsaved draft</div>
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-accent">{draft.sessionNumber ? `Think Session ${draft.sessionNumber}` : "Think Session"}</p>
        <h1 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">{draft.title || "Untitled session"}</h1>
        <p className="mt-4 text-foreground/60">{draft.startDate || "Date not set"} · {draft.format || draft.location || "Online"}</p>
        {draft.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-4">{draft.tags.map((tag) => <span key={tag} className="text-xs font-bold uppercase text-accent">{tag}</span>)}</div>}
        <section className="mt-12">
          <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-foreground/40">About this session</h2>
          <p className="text-xl leading-relaxed text-foreground/80">{draft.description || "No description yet."}</p>
          {draft.shortDescription && <p className="mt-4 text-foreground/60">{draft.shortDescription}</p>}
        </section>
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-black uppercase tracking-widest text-foreground/40">Speakers</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {draft.speakers.map((speaker, index) => (
              <article key={speaker.id || `${speaker.name}-${index}`} className="flex gap-5 border border-foreground/10 p-5">
                {speaker.avatar ? <Image src={speaker.avatar} alt={speaker.name} width={80} height={80} className="h-20 w-20 rounded-full object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-2xl font-black">{speaker.name?.[0] || "?"}</div>}
                <div><h3 className="font-black uppercase">{speaker.name || "Unnamed speaker"}</h3><p className="mt-1 text-xs uppercase text-accent">{[speaker.title || speaker.role, speaker.organization].filter(Boolean).join(" · ")}</p><p className="mt-2 text-sm text-foreground/60">{speaker.topic}</p><p className="mt-2 text-sm">{speaker.bio}</p></div>
              </article>
            ))}
          </div>
        </section>
        {draft.sessionNotes && <section className="mt-12"><h2 className="font-black uppercase">After-session notes</h2><p className="mt-3 whitespace-pre-line">{draft.sessionNotes}</p></section>}
        {draft.recordingUrl && <a href={draft.recordingUrl} className="mt-8 inline-flex text-accent">Watch the recording</a>}
        {draft.resources && <p className="mt-5 whitespace-pre-line">{draft.resources}</p>}
        {draft.link && <a href={draft.link} className="btn-primary mt-8 inline-flex">RSVP on Luma</a>}
      </div>
    </main>
  );
}
