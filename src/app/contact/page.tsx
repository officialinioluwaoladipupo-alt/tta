"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";

const whatsapp = "https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO";
const email = "thethinkingarchitect.africa@gmail.com";

export default function Contact() {
  return <main className="bg-background min-h-screen text-foreground">
    <section className="max-w-[1200px] mx-auto px-6 pt-36 md:pt-48 pb-24"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
      <GlitchText as="h1" text="GET IN TOUCH" className="text-5xl sm:text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-10" />
      <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">Have a question, an idea, or something you&apos;d like to explore with us? We&apos;d like to hear it.</p>
    </motion.div></section>
    <section className="border-y border-foreground/10"><div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div><h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10">What to Reach Out About</h2><div className="space-y-6 text-lg text-foreground/70 leading-relaxed"><p><strong className="text-foreground">General</strong> · Questions about TTA, Think Sessions, or getting involved.</p><p><strong className="text-foreground">Partnerships</strong> · Sponsorships, collaborations, and institutional partnerships.</p><p><strong className="text-foreground">Media</strong> · Press, interviews, and feature requests.</p><p>Quick question? Our <a href={whatsapp} target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">WhatsApp community →</a> is often the faster way to get an answer.</p></div></div>
      <div className="border border-foreground/10 p-8 md:p-12 bg-foreground/[0.02]"><h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Email Us</h2><a href={`mailto:${email}`} className="text-xl md:text-2xl font-bold text-accent break-all hover:underline">{email}</a><p className="mt-6 text-foreground/60 leading-relaxed">We read every message and respond within 2-5 business days.</p><a href={`mailto:${email}`} className="btn-primary inline-flex mt-10">Send an Email →</a></div>
    </div></section>
  </main>;
}
