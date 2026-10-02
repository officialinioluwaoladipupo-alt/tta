import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import TallyPopupButton from "@/components/ui/TallyPopupButton";
import { getTeamMembers } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "About TTA | The Thinking Architect",
  description: "The story behind The Thinking Architect: a community, programme and media platform for architecture and the people around it.",
};

const practices = [
  { number: "01", title: "Awareness", description: "The realities of practice, said plainly." },
  { number: "02", title: "Design", description: "Craft and critique that go past the studio brief." },
  { number: "03", title: "Exposure", description: "Architects, work and ideas you would not otherwise meet." },
  { number: "04", title: "Mentorship", description: "Guidance from people a few steps ahead." },
  { number: "05", title: "Opportunity", description: "Programmes, openings and connections, shared early." },
  { number: "06", title: "Impact", description: "Work that serves people and communities, not only the brief." },
];

const beliefs = [
  { title: "Honesty over polish.", description: "Most of what architects learn never reaches a portfolio, and it is worth more than what does." },
  { title: "Knowledge should move freely.", description: "What one person learned the hard way should not be gated from the next." },
  { title: "Judgment is learned from others.", description: "It comes from hearing how people decided, not only what they built." },
  { title: "Buildings and cities serve people.", description: "So the conversations about how we make them matter as much as the making." },
];

export default async function About() {
  const team = await getTeamMembers();
  const founder = team.find((member) => member.name.trim().toLowerCase() === "inioluwa oladipupo");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1600px] px-6 pb-20 pt-36 md:pb-32 md:pt-48">
        <p className="mb-7 text-xs font-black uppercase tracking-[0.24em] text-accent">The Thinking Architect</p>
        <h1 className="max-w-6xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-8xl md:text-[10rem]">About <span className="text-accent">TTA.</span></h1>
        <p className="mt-10 max-w-4xl text-2xl font-semibold leading-snug text-foreground/70 md:mt-14 md:text-4xl">
          The Thinking Architect is a community, a set of programmes and a media platform for architecture and the people around it.
        </p>
      </section>

      <section className="border-y border-foreground/10 bg-[#ebe7e1]">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 md:grid-cols-[0.35fr_1fr] md:gap-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">The gap</p>
          <div className="max-w-5xl space-y-6 text-xl leading-relaxed text-foreground/70 md:text-2xl">
            <p>Architecture teaches a great deal, but some of what shapes an architect is never said out loud: how practice really works, the mistakes nobody warns you about, the openings you hear about too late.</p>
            <p>That is true for a student in studio and for an architect fifteen years into practice. Most of us worked it out alone, and most of us worked it out late. TTA exists so fewer people have to.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden border border-foreground/10 bg-accent/10 md:mx-0">
          {founder?.photoUrl ? (
            <Image src={founder.photoUrl} alt="Inioluwa Oladipupo, founder of The Thinking Architect" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#ebe7e1]">
              <span className="text-[clamp(8rem,24vw,18rem)] font-black leading-none tracking-[-0.1em] text-accent/80">IO</span>
              <span className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/45">Founder, TTA</span>
            </div>
          )}
          <span className="absolute bottom-4 left-4 bg-background px-4 py-3 text-xs font-black uppercase tracking-widest">Inioluwa Oladipupo</span>
        </div>
        <div className="self-center">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.22em] text-accent">Why I started TTA</p>
          <h2 className="mb-8 text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl md:text-7xl">I was still in the middle of it.</h2>
          <div className="space-y-5 text-base leading-relaxed text-foreground/70 md:text-lg">
            <p>I&apos;m Inioluwa Oladipupo, an architecture student at the University of Ibadan. I started TTA in January 2026, and I&apos;m still in the middle of it: studio, deadlines, and everything else that comes with the course.</p>
            <p>TTA came from frustration. I was sitting in lectures, doing studio work and chasing grades, and I kept noticing how much was missing. We had plenty of theory. What we didn&apos;t have was the rest: what happens after school, what it feels like to fail a project you gave months to, or to sit three years in and realise you don&apos;t fully understand something you were meant to have mastered.</p>
            <p>None of that is anyone&apos;s fault. It&apos;s just not what gets said in a lecture hall. By the time it reaches you, it&apos;s often too late to use it the way you needed.</p>
            <p>The truth doesn&apos;t stop mattering after graduation, so this was never only a student&apos;s problem. And it goes beyond personal growth. The buildings and cities we are trained to design are meant to serve real people and real communities. When the systems around them fail, it is a human problem, not only a technical one. That is why these conversations matter as much as anything taught in a lecture hall.</p>
            <p>So we built something practical: honest conversations with architects who tell you the truth, and a community where the conversation carries on. Underneath it are two commitments: honesty over polish, and knowledge that moves freely instead of being gatekept.</p>
            <p className="border-l-2 border-accent pl-5 text-xl font-bold text-foreground md:text-2xl">If you hold on to one thing, let it be this: none of us should have to figure it out alone, the hard way, years too late.</p>
          </div>
          <div className="mt-8 border-t border-foreground/10 pt-5">
            <p className="font-black uppercase tracking-wide">Inioluwa Oladipupo</p>
            <p className="mt-1 text-sm text-foreground/50">Founder, The Thinking Architect</p>
          </div>
        </div>
      </section>

      <section className="bg-accent text-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-white/70">What we do</p>
          <h2 className="mb-12 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:mb-16 md:text-7xl">We work on the whole gap, not one part of it.</h2>
          <div className="grid border-l border-t border-white/25 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map((item) => (
              <article key={item.number} className="min-h-52 border-b border-r border-white/25 p-6 sm:p-8 md:min-h-60 md:p-10">
                <span className="text-xs font-black tracking-widest text-white/65">{item.number}</span>
                <h3 className="mt-9 text-2xl font-black uppercase tracking-tight md:text-3xl">{item.title}<span className="text-foreground">.</span></h3>
                <p className="mt-3 max-w-sm leading-relaxed text-white/85">{item.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-5xl text-base leading-relaxed text-white/90 md:text-xl">
            Think Sessions and our WhatsApp community are where most of this happens today. Our media carries it further, so a conversation held once can be learned from by anyone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.45fr_1fr] md:gap-20">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">What we believe</p>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">The principles underneath it.</h2>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {beliefs.map((belief, index) => (
              <article key={belief.title} className="grid gap-3 py-6 sm:grid-cols-[2rem_0.8fr_1fr] sm:gap-5 md:py-8">
                <span className="text-xs font-black tracking-widest text-accent">0{index + 1}</span>
                <h3 className="text-lg font-black uppercase tracking-tight md:text-xl">{belief.title}</h3>
                <p className="leading-relaxed text-foreground/60">{belief.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-[#ebe7e1]">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">Who it&apos;s for</p>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">If you care what gets built, you belong here.</h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/65 md:text-xl">Students, early-career and practising architects, educators, and others in the built environment. Anyone who wants honest conversation about how places get made is welcome.</p>
          </div>
          <div className="flex flex-col justify-between gap-10 border-l border-foreground/10 pl-6 md:pl-10">
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">Where we&apos;re going</p>
              <p className="text-xl font-semibold leading-relaxed md:text-2xl">A conversation in one city helps a few people. The same conversation, held in many cities and led by the people who live there, changes how a profession prepares its next generation.</p>
            </div>
            <p className="text-base leading-relaxed text-foreground/60 md:text-lg">We are building outward, with the same two commitments in every step.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-[0.35fr_1fr] md:gap-20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">TTA is not</p>
          <div>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">A firm. A school. A credentialing body.</h2>
            <p className="mt-6 max-w-4xl text-lg leading-relaxed text-foreground/65 md:text-2xl">TTA isn&apos;t a firm, a school or a credentialing body. It&apos;s a place to ask better questions, hear different answers and work out what kind of architect you want to be.</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-foreground/10 px-6 py-24 text-center md:py-36">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,700px)] w-[min(80vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">Join us</p>
          <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl md:text-8xl">There is a seat here for you.</h2>
          <TallyPopupButton className="btn-primary mx-auto mt-9 min-h-14 justify-center px-8">Get involved <ArrowRight size={18} /></TallyPopupButton>
          <a href="https://www.linkedin.com/company/the-thinking-architect/" target="_blank" rel="noreferrer" className="mx-auto mt-6 flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-foreground/50 hover:text-accent">Follow TTA <ArrowUpRight size={15} /></a>
        </div>
      </section>
    </main>
  );
}
