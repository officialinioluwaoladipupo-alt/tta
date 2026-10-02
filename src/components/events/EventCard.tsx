import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, Radio } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/event-data";

export default function EventCard({ event, past = false }: { event: Event; past?: boolean }) {
  const speakers = event.speakers?.map((speaker) => speaker.name).filter(Boolean) ?? [];

  return (
    <article className="group flex h-full flex-col border border-foreground/10 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[8px_8px_0_var(--accent)] md:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-accent">
          {past ? <Radio size={14} /> : <CalendarDays size={14} />}
          {event.sessionNumber ? `Session ${event.sessionNumber}` : "Think Session"}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{past ? "Watch and learn" : "Next up"}</span>
      </div>

      <Link href={`/events/${event.slug}`} className="group/title">
        <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-tight transition-colors group-hover/title:text-accent md:text-3xl">{event.title}</h3>
      </Link>

      <div className="mt-6 grid gap-3 border-y border-foreground/10 py-5 text-sm font-semibold text-foreground/65 sm:grid-cols-2">
        <p className="flex items-center gap-2"><CalendarDays size={15} className="shrink-0 text-accent" />{event.displayDate}</p>
        <p className="flex items-center gap-2"><Clock3 size={15} className="shrink-0 text-accent" />{event.time}</p>
        <p className="sm:col-span-2">{event.format}</p>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Speakers</p>
        <p className="mt-2 font-bold leading-relaxed text-foreground/75">{speakers.length ? speakers.join(", ") : "Speaker details coming soon"}</p>
      </div>

      {past ? (
        event.recordingUrl ? (
          <a href={event.recordingUrl} target="_blank" rel="noreferrer" className="btn-primary mt-8 min-h-12 justify-between">Watch recording <ArrowUpRight size={18} /></a>
        ) : (
          <Link href={`/events/${event.slug}`} className="mt-8 inline-flex min-h-12 items-center justify-between border border-foreground/15 px-4 text-xs font-black uppercase tracking-widest text-foreground/60">Session details <ArrowRight size={16} /></Link>
        )
      ) : event.link ? (
        <a href={event.link} target="_blank" rel="noreferrer" className="btn-primary mt-8 min-h-12 justify-between">RSVP on Luma <ArrowUpRight size={18} /></a>
      ) : (
        <p className="mt-8 border border-foreground/10 px-4 py-3 text-xs font-bold text-foreground/50">RSVP details coming soon</p>
      )}
    </article>
  );
}
