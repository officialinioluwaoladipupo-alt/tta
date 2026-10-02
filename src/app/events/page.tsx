import type { Metadata } from "next";
import { ArrowRight, MessageCircle, Play, Radio } from "lucide-react";
import { getUpcomingEvents, getPastEvents } from "@/lib/event-data";
import EventCard from "@/components/events/EventCard";
import TallyPopupButton from "@/components/ui/TallyPopupButton";

export const metadata: Metadata = {
  title: "Think Sessions | The Thinking Architect",
  description: "Think Sessions are honest conversations with working architects about career, craft and the decisions behind both. RSVP or watch past sessions.",
};

const howItWorks = [
  { icon: Radio, title: "Join live.", copy: "Sessions run online, so you can join from anywhere. RSVP on Luma and you get the link and a reminder." },
  { icon: MessageCircle, title: "Bring a question.", copy: "Every session leaves time for yours." },
  { icon: Play, title: "Watch later.", copy: "Recordings are published on our Media page." },
];

export default async function EventsPage() {
  const [allUpcoming, allPast] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const pastEvents = allPast.filter((event) => Boolean(event.recordingUrl));

  return (
    <main className="min-h-screen bg-background pb-20 pt-32 text-foreground">
      <div className="mx-auto max-w-[1600px] px-6">
        <header className="max-w-5xl pb-20 md:pb-28">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-accent">The Thinking Architect · Live and on record</p>
          <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-8xl md:text-[10rem]">Think<br className="sm:hidden" /> Sessions<span className="text-accent">.</span></h1>
          <p className="mt-9 max-w-4xl text-xl font-medium leading-relaxed text-foreground/65 md:mt-12 md:text-3xl">
            Honest conversations with people working in architecture. Career, craft and the decisions behind both, said the way they are said when the room is private.
          </p>
        </header>

        <section aria-labelledby="upcoming-heading" className="border-t border-foreground/10 py-16 md:py-24">
          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-accent">Next up</p>
              <h2 id="upcoming-heading" className="text-3xl font-black uppercase tracking-tight sm:text-5xl">Join the conversation.</h2>
            </div>
            <span className="hidden text-xs font-bold uppercase tracking-widest text-foreground/35 sm:block">Live sessions</span>
          </div>
          {allUpcoming.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allUpcoming.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <div className="border border-foreground/10 bg-[#ebe7e1] p-8 md:p-14">
              <p className="max-w-3xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">The next Think Session is being finalised.</p>
              <p className="mt-5 text-base text-foreground/60 md:text-lg">Join the community to hear first.</p>
              <TallyPopupButton className="btn-primary mt-7">Join the community <ArrowRight size={17} /></TallyPopupButton>
            </div>
          )}
        </section>

        <section aria-labelledby="how-heading" className="border-y border-foreground/10 py-16 md:py-24">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-accent">A good room makes room</p>
          <h2 id="how-heading" className="mb-9 text-3xl font-black uppercase tracking-tight sm:text-5xl">How a session works</h2>
          <div className="grid border-l border-t border-foreground/10 sm:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="min-h-56 border-b border-r border-foreground/10 p-6 md:p-8">
                <div className="flex items-center justify-between"><span className="text-xs font-black tracking-widest text-accent">0{index + 1}</span><Icon size={19} className="text-accent" /></div>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-tight">{title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/60">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="past-heading" className="py-16 md:py-24">
          <div className="mb-9">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-accent">Watch and learn</p>
            <h2 id="past-heading" className="text-3xl font-black uppercase tracking-tight sm:text-5xl">Past sessions</h2>
          </div>
          {pastEvents.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pastEvents.map((event) => <EventCard key={event.id} event={event} past />)}
            </div>
          ) : (
            <p className="border border-dashed border-foreground/20 p-8 text-foreground/55 md:p-12">Past sessions will appear here once recordings are published.</p>
          )}
        </section>

        <section className="mt-10 border-t border-foreground/10 py-16 text-center md:py-24">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">Stay in the loop</p>
          <h2 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">Don&apos;t miss the next one.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/60">Join the community to hear first.</p>
          <a href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO" target="_blank" rel="noreferrer" className="btn-outline mx-auto mt-8 min-h-14 justify-center px-8">Join on WhatsApp <ArrowRight size={18} /></a>
        </section>
      </div>
    </main>
  );
}
