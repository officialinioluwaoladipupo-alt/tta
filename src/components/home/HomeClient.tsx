"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarDays, Play, UsersRound } from "lucide-react";
import Link from "next/link";
import Marquee from "@/components/ui/Marquee";
import TallyPopupButton from "@/components/ui/TallyPopupButton";
import { Event } from "@/lib/event-data";
import type { Video } from "@/lib/youtube";

const principles = [
  { number: "01", title: "Awareness", description: "The realities of practice, said plainly." },
  { number: "02", title: "Design", description: "Craft and critique that go past the studio brief." },
  { number: "03", title: "Exposure", description: "Architects, work and ideas you would not otherwise meet." },
  { number: "04", title: "Mentorship", description: "Guidance from people a few steps ahead." },
  { number: "05", title: "Opportunity", description: "Programmes, openings and connections, shared early." },
  { number: "06", title: "Impact", description: "Work that serves people and communities, not only the brief." },
];

const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

export default function HomeClient({
  marqueeText,
  upcomingEvents = [],
  latestVideos = [],
}: {
  marqueeText: string;
  upcomingEvents?: Event[];
  latestVideos?: Video[];
}) {
  const currentYear = new Date().getFullYear().toString();
  const processedMarquee = marqueeText.replace(/<CurrentYear \/>/g, currentYear);
  const nextSession = upcomingEvents[0];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center border-b border-foreground/10 px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true">
          <div className="absolute -right-32 top-12 h-[min(75vw,760px)] w-[min(75vw,760px)] rounded-full border border-foreground" />
          <div className="absolute -right-16 top-28 h-[min(62vw,620px)] w-[min(62vw,620px)] rounded-full border border-accent" />
          <div className="absolute bottom-0 right-[12%] top-0 w-px bg-foreground" />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="relative mx-auto w-full max-w-[1600px]"
        >
          <motion.p variants={riseVariants} className="mb-8 text-xs font-black uppercase tracking-[0.24em] text-accent md:text-sm">
            The Thinking Architect · TTA
          </motion.p>
          <motion.h1 variants={riseVariants} className="max-w-6xl text-[clamp(3.2rem,10.8vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
            Learn it <span className="text-accent">/</span><br />before it<br className="sm:hidden" /> costs you<span className="text-accent">.</span>
          </motion.h1>
          <motion.div variants={riseVariants} className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)] md:items-end">
            <p className="max-w-3xl text-lg font-medium leading-relaxed text-foreground/70 md:text-2xl">
              TTA is a community, a set of programmes and a media platform for architecture and the people around it. Honest conversations, mentorship and opportunity, shared early.
            </p>
            <div className="md:justify-self-end md:text-right">
              <p className="text-sm font-bold leading-relaxed text-foreground/55 md:text-base">Built by architects.<br />Open to anyone who cares what gets built.</p>
            </div>
          </motion.div>
          <motion.div variants={riseVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <TallyPopupButton className="btn-primary min-h-14 justify-center px-7 text-sm">
              Join the community <ArrowRight size={18} />
            </TallyPopupButton>
            <Link href="/events" className="btn-outline min-h-14 justify-center px-7 text-sm">
              See the next Think Session <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div aria-label="The Thinking Architect" className="border-b border-foreground/10">
        <Marquee text={processedMarquee} className="bg-accent/5 text-accent" repeat={4} speed={40} />
      </div>

      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.3fr_1fr] lg:gap-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Up next</p>
            <p className="mt-3 text-sm text-foreground/45">Think Sessions</p>
          </div>
          <div className="relative overflow-hidden border border-foreground/10 bg-[#ebe7e1] p-7 shadow-[8px_8px_0_var(--accent)] sm:p-10 md:p-14">
            <span className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-accent/20" aria-hidden="true" />
            {nextSession ? (
              <div className="relative flex flex-col items-start gap-5">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-accent"><CalendarDays size={15} /> Upcoming conversation</span>
                <h2 className="max-w-4xl text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">{nextSession.title}</h2>
                <p className="text-base font-semibold text-foreground/60 md:text-lg">
                  {nextSession.speakers?.map((speaker) => speaker.name).join(", ") || "Think Sessions"} · {nextSession.displayDate}
                </p>
                <p className="max-w-2xl leading-relaxed text-foreground/70">{nextSession.shortDescription || nextSession.description}</p>
                <a
                  href={nextSession.link || `/events/${nextSession.slug}`}
                  target={nextSession.link ? "_blank" : undefined}
                  rel={nextSession.link ? "noreferrer" : undefined}
                  className="btn-primary mt-2"
                >Reserve your spot <ArrowRight size={18} /></a>
              </div>
            ) : (
              <div className="relative max-w-3xl">
                <h2 className="text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">The next Think Session is being finalised.</h2>
                <p className="mt-5 text-base leading-relaxed text-foreground/65">Join the community to hear first.</p>
                <TallyPopupButton className="btn-primary mt-7">Join the community <ArrowRight size={18} /></TallyPopupButton>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-accent text-white">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 md:grid-cols-[0.8fr_1fr] md:items-center md:gap-20 md:py-32">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">Why TTA exists</p>
          <div>
            <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:text-7xl">Nobody learns architecture alone.</h2>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-white/90 md:text-2xl">
              Some of what shapes an architect is never taught: how practice really works, the mistakes nobody warns you about, the openings you hear about too late. That is true in your first year and in your fifteenth. TTA exists so more of it gets said out loud.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end md:mb-16">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">What we do</p>
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">Knowledge should move freely.</h2>
          </div>
          <span className="hidden text-xs font-bold uppercase tracking-widest text-foreground/40 sm:block">01 — 06 / TTA principles</span>
        </div>
        <div className="grid border-l border-t border-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <article key={item.number} className="group min-h-56 border-b border-r border-foreground/10 p-7 transition-colors hover:bg-accent/[0.04] sm:p-9 md:min-h-64">
              <div className="flex items-start justify-between">
                <span className="text-xs font-black tracking-widest text-accent">{item.number}</span>
                <ArrowUpRight size={17} className="text-foreground/25 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              <h3 className="mt-10 text-2xl font-black uppercase tracking-tight md:text-3xl">{item.title}<span className="text-accent">.</span></h3>
              <p className="mt-3 max-w-sm leading-relaxed text-foreground/60">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-[#ebe7e1]">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 md:grid-cols-[0.55fr_1fr] md:py-28">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Latest from TTA</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl">Ideas worth passing on.</h2>
          </div>
          <div>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-foreground/65">Conversations and stories from architects, published openly for anyone who cares how places get made.</p>
            {latestVideos.length > 0 ? (
              <div className="divide-y divide-foreground/15 border-y border-foreground/15">
                {latestVideos.slice(0, 3).map((video, index) => (
                  <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="group flex items-center gap-5 py-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-foreground/15 text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white"><Play size={17} fill="currentColor" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-foreground/40">Conversation 0{index + 1} · {video.date}</span>
                      <span className="block text-lg font-bold leading-snug group-hover:text-accent sm:text-xl">{video.title}</span>
                    </span>
                    <ArrowUpRight size={20} className="shrink-0 text-foreground/40 transition-colors group-hover:text-accent" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="border-y border-foreground/15 py-6 text-sm text-foreground/55">New conversations are on the way. Explore the TTA media archive.</p>
            )}
            <Link href="/media" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-accent hover:text-foreground">Watch and read more <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:py-32">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">Ways to take part</p>
          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">Find your way into the conversation.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <TakePartCard number="01" title="Think Sessions" description="Monthly conversations with working architects about career, craft and the decisions behind both." href="/events" action="See Think Sessions" />
          <TakePartCard number="02" title="Community" description="A WhatsApp space where the conversation carries on between sessions." href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO" action="Join on WhatsApp" external />
          <TakePartCard number="03" title="Events" description="RSVP for the next session and get the reminder." href={nextSession?.link || "/events"} action="RSVP on Luma" external={Boolean(nextSession?.link)} />
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-20 md:grid-cols-[0.35fr_1fr] md:py-28">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Where we&apos;re going</p>
          <div className="max-w-5xl">
            <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl">One conversation can travel further.</h2>
            <p className="mt-8 text-lg leading-relaxed text-background/70 md:text-2xl">
              A conversation in one city helps a few people. The same conversation, held in many cities and led by the people who live there, changes how a profession prepares its next generation.
            </p>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-relaxed text-background/55 md:text-lg">
              We are building outward. Each step carries the same two commitments: honesty over polish, and knowledge that moves freely.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 text-center md:py-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(75vw,760px)] w-[min(75vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl">
          <UsersRound className="mx-auto mb-7 text-accent" size={30} strokeWidth={1.5} />
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">TTA is better with you in it</p>
          <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl md:text-8xl">There is a seat for you.</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-foreground/60 md:text-xl">
            Studying, starting out, years into practice, teaching, working alongside architects, or simply curious about how places get made.
          </p>
          <TallyPopupButton className="btn-primary mx-auto mt-9 min-h-14 justify-center px-8">Get involved <ArrowRight size={18} /></TallyPopupButton>
        </div>
      </section>
    </div>
  );
}

function TakePartCard({
  number,
  title,
  description,
  href,
  action,
  external = false,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
  action: string;
  external?: boolean;
}) {
  return (
    <article className="flex min-h-80 flex-col border border-foreground/10 p-7 transition-colors hover:border-accent/50 hover:bg-accent/[0.03] md:p-9">
      <span className="text-xs font-black tracking-widest text-accent">{number} / TTA</span>
      <h3 className="mt-9 text-2xl font-black uppercase tracking-tight md:text-3xl">{title}</h3>
      <p className="mt-4 flex-1 leading-relaxed text-foreground/60">{description}</p>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-accent">{action} <ArrowUpRight size={16} /></a>
      ) : (
        <Link href={href} className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-accent">{action} <ArrowRight size={16} /></Link>
      )}
    </article>
  );
}
