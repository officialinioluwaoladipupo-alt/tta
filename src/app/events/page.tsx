import { getUpcomingEvents, getPastEvents } from "@/lib/event-data";
import EventCard from "@/components/events/EventCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Think Sessions - The Thinking Architect",
    description: "Monthly conversations that examine how architects think, decide, and hold up under real practice, not theory.",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  const pastEvents = await getPastEvents();

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="mb-20 max-w-4xl">
          <span className="text-sm font-black uppercase tracking-[0.3em] text-accent block mb-6">
            Think Sessions
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground uppercase">
            Think Sessions
          </h1>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-foreground/20 rounded-lg">
            <p className="text-xl font-bold uppercase tracking-widest text-foreground/40">
              No session scheduled yet, check back soon.
            </p>
            <p className="mt-2 text-foreground/30">Check back later or join the community for updates.</p>
          </div>
        )}

        <section className="mt-32">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10">Past Sessions</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="border border-dashed border-foreground/20 p-10 text-foreground/50">Past sessions will appear here.</p>
          )}
        </section>

        {/* Newsletter / CTA Section */}
        <div className="mt-40 border-t border-foreground/10 pt-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Don&apos;t miss the next one.
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto mb-10 text-lg">
            Join the Community for session updates.
          </p>
          <a href="/join" className="btn-primary inline-flex">
            Join the Community
          </a>
        </div>
      </div>
    </main>
  );
}
