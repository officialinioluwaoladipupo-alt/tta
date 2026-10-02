import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";

const WHATSAPP_URL = "https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO";
const CONTACTS = [
  { label: "General", description: "Questions about TTA, Think Sessions or getting involved.", email: "hello@thethinkingarchitects.com.ng", subject: "General enquiry" },
  { label: "Partnerships", description: "Sponsorships, collaborations and institutional partnerships.", email: "partnerships@thethinkingarchitects.com.ng", subject: "Partnership enquiry" },
  { label: "Media", description: "Press, interviews and feature requests.", email: "media@thethinkingarchitects.com.ng", subject: "Media enquiry" },
  { label: "Share your story", description: "Have an honest account of how architecture is really made? We’d like to read it.", email: "media@thethinkingarchitects.com.ng", subject: "Story submission" },
];

export const metadata: Metadata = {
  title: "Contact | The Thinking Architect",
  description: "Contact The Thinking Architect for questions, partnerships, media requests and story submissions. We reply within 2 to 5 business days.",
};

export default function ContactPage() {
  const general = CONTACTS[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1200px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">Contact</p>
        <GlitchText as="h1" text="GET IN TOUCH" className="mb-8 text-5xl font-black leading-[0.9] tracking-tighter sm:text-7xl md:text-9xl" />
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-2xl">Have a question, an idea, or something you&apos;d like to explore with us? We&apos;d like to hear it.</p>
      </section>

      <section className="border-y border-foreground/10">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <div>
            <h2 className="mb-7 text-3xl font-black tracking-tight sm:text-4xl">What to reach out about</h2>
            <div className="space-y-6">
              {CONTACTS.map((contact) => <p key={contact.label} className="text-base leading-relaxed text-foreground/70 sm:text-lg">
                <strong className="text-foreground">{contact.label}.</strong> {contact.description}{" "}
                <a href={`mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`} className="font-semibold text-accent underline-offset-4 hover:underline">{contact.email}</a>
              </p>)}
            </div>
            <p className="mt-8 text-base leading-relaxed text-foreground/70">Quick question? Our WhatsApp community is often the faster way to get an answer.{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-accent hover:underline">Join on WhatsApp <ArrowUpRight size={15} /></a>
            </p>
          </div>

          <aside className="self-start border border-foreground/10 bg-foreground/[0.02] p-6 sm:p-9">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Email us</h2>
            <a href={`mailto:${general.email}?subject=${encodeURIComponent(general.subject)}`} className="mt-5 inline-block break-all text-lg font-bold text-accent hover:underline sm:text-xl">{general.email}</a>
            <p className="mt-5 leading-relaxed text-foreground/60">We read every message and reply within 2 to 5 business days.</p>
            <a href={`mailto:${general.email}?subject=${encodeURIComponent(general.subject)}`} className="btn-primary mt-7 min-h-12 px-6">Send an email <ArrowUpRight size={17} /></a>
          </aside>
        </div>
      </section>

      <p className="mx-auto max-w-[1200px] px-5 py-12 text-center text-lg text-foreground/60 sm:px-8 sm:py-16">Whatever brings you here, we&apos;re glad you wrote.</p>
    </main>
  );
}
