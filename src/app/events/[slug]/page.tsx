import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3, ExternalLink, MapPin, MessageCircle, Play } from "lucide-react";
import { getEventBySlug } from "@/lib/event-data";
import TallyPopupButton from "@/components/ui/TallyPopupButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Session not found | The Thinking Architect" };
  return {
    title: `${event.title} | Think Sessions | TTA`,
    description: event.seoDescription || event.shortDescription || event.description,
    openGraph: { images: event.seoImage ? [{ url: event.seoImage }] : undefined },
  };
}

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isPast = event.status === "past";
  const questionContext = {
    slug: event.slug,
    title: event.title,
    number: event.sessionNumber || "",
    speakers: event.speakers?.map((speaker) => speaker.name).join(", ") || "",
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-32 text-foreground">
      <div className="mx-auto max-w-[1440px] px-6">
        <Link href="/events" className="mb-9 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/50 transition-colors hover:text-accent"><ArrowLeft size={16} /> All Think Sessions</Link>

        <header className="grid gap-10 border-b border-foreground/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:pb-16">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">{event.sessionNumber ? `Think Session ${event.sessionNumber}` : "Think Session"} · {isPast ? "Recording and notes" : "Upcoming conversation"}</p>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl md:text-8xl">{event.title}</h1>
          </div>
          {isPast && event.recordingUrl ? (
            <a href={event.recordingUrl} target="_blank" rel="noreferrer" className="btn-primary min-h-14 justify-center px-6">Watch the recording <Play size={17} fill="currentColor" /></a>
          ) : !isPast && event.link ? (
            <a href={event.link} target="_blank" rel="noreferrer" className="btn-primary min-h-14 justify-center px-6">RSVP on Luma <ArrowUpRight size={17} /></a>
          ) : (
            <span className="border border-foreground/15 px-5 py-4 text-xs font-bold text-foreground/50">{isPast ? "Recording not published yet" : "RSVP details coming soon"}</span>
          )}
        </header>

        {event.image && (
          <div className="relative mt-10 h-[clamp(14rem,38vw,32rem)] overflow-hidden bg-foreground/5">
            <Image src={event.image} alt="" fill className="object-contain" priority sizes="100vw" />
          </div>
        )}

        <section className="grid gap-12 py-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:py-16">
          <div className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <MetaItem icon={<CalendarDays size={18} />} label="Date" value={event.displayDate} />
            <MetaItem icon={<Clock3 size={18} />} label="Time" value={event.time} />
            <MetaItem icon={<MessageCircle size={18} />} label="Format" value={event.format} />
            {event.location && event.location !== event.format && <MetaItem icon={<MapPin size={18} />} label="Location" value={event.location} />}
          </div>
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">About this session</p>
            <div className="max-w-4xl space-y-5 text-lg leading-relaxed text-foreground/70 md:text-xl">
              {(event.description || "More details about this conversation will be shared soon.").split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {event.shortDescription && <p className="mt-6 max-w-4xl border-l-2 border-accent pl-5 font-semibold leading-relaxed text-foreground">{event.shortDescription}</p>}
          </div>
        </section>

        {event.speakers && event.speakers.length > 0 && (
          <section className="border-t border-foreground/10 py-12 md:py-16">
            <p className="mb-8 text-xs font-black uppercase tracking-[0.22em] text-accent">The people in the room</p>
            <h2 className="mb-8 text-3xl font-black uppercase tracking-tight md:text-5xl">Speakers</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {event.speakers.map((speaker, index) => (
                <article key={speaker.id || `${speaker.name}-${index}`} className="grid gap-5 border border-foreground/10 p-5 sm:grid-cols-[8rem_1fr] sm:gap-7 sm:p-7">
                  <div className="relative aspect-square w-full overflow-hidden bg-[#ebe7e1] sm:w-32">
                    {speaker.avatar ? <Image src={speaker.avatar} alt={speaker.name} fill sizes="128px" className="object-contain" /> : <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-accent">{speaker.name?.slice(0, 1) || "?"}</div>}
                  </div>
                  <div className="self-center">
                    <h3 className="text-2xl font-black uppercase leading-tight tracking-tight">{speaker.name}</h3>
                    {(speaker.role || speaker.title || speaker.organization) && <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-accent">{[speaker.role || speaker.title, speaker.organization].filter(Boolean).join(" · ")}</p>}
                    {speaker.bio && <p className="mt-4 leading-relaxed text-foreground/65">{speaker.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!isPast && (
          <section className="border-y border-foreground/10 bg-[#ebe7e1] py-10 md:py-14">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-accent">Before the session</p>
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">Ask before the conversation.</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-foreground/65">What do you want to hear from {event.speakers?.[0]?.name || "our speakers"}? Send your question ahead of time.</p>
              </div>
              <TallyPopupButton formId="MeB2NX" sessionContext={questionContext} thankYouMessage="Thank you. Your question is with us, and we will bring it to the next conversation." className="btn-outline min-h-14 justify-center px-6">Send a question <ArrowRight size={17} /></TallyPopupButton>
            </div>
          </section>
        )}

        {isPast && (event.sessionNotes || event.resources.length > 0) && (
          <section className="border-t border-foreground/10 py-12 md:py-16">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">After the session</p>
            <h2 className="mb-6 text-3xl font-black uppercase tracking-tight md:text-5xl">Notes, links and resources</h2>
            {event.sessionNotes && <p className="max-w-4xl whitespace-pre-line text-lg leading-relaxed text-foreground/70">{event.sessionNotes}</p>}
            {event.resources.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{event.resources.map((resource, index) => <li key={`${resource}-${index}`}>{isWebUrl(resource) ? <a href={resource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-accent hover:text-foreground">Resource {index + 1} <ExternalLink size={15} /></a> : <span className="text-foreground/70">{resource}</span>}</li>)}</ul>}
          </section>
        )}

        <section className="mt-10 border-y border-foreground/10 py-12 text-center md:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">A question for the next conversation?</p>
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">Bring the question you are carrying.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground/60 md:text-lg">Ask what you have been wondering about. We pass questions to the speakers, and no question is too basic.</p>
          <TallyPopupButton formId="MeB2NX" sessionContext={questionContext} thankYouMessage="Thank you. Your question is with us, and we will bring it to the next conversation." className="btn-primary mx-auto mt-7 min-h-14 justify-center px-7">Send a question <ArrowRight size={17} /></TallyPopupButton>
        </section>

        <section className="pt-12 text-center md:pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">Don&apos;t miss the next one.</h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">Join the community to hear first.</p>
          <a href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO" target="_blank" rel="noreferrer" className="btn-outline mx-auto mt-7 min-h-14 justify-center px-7">Join on WhatsApp <ArrowRight size={17} /></a>
        </section>
      </div>
    </main>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3 border-b border-foreground/10 pb-4">
    <span className="mt-1 text-accent">{icon}</span>
    <div><span className="block text-[10px] font-black uppercase tracking-widest text-foreground/40">{label}</span><span className="mt-1 block font-bold">{value}</span></div>
  </div>;
}
