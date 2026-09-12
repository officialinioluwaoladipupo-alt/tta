"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";

export default function About() {
  return <main className="bg-background min-h-screen text-foreground">
    <section className="max-w-[1200px] mx-auto px-6 pt-36 md:pt-48 pb-24"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
      <GlitchText as="h1" text="ABOUT TTA" className="text-5xl sm:text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-12" />
      <div className="space-y-6 text-xl md:text-2xl text-foreground/70 leading-relaxed font-medium">
        <p>The Thinking Architect is a community for architects who want to think out loud.</p>
        <p>We started in January 2026 with a simple belief: architecture gets better when practitioners talk honestly about it, not just showcase it. So we built spaces for that. Think Sessions bring in architects to share what they&apos;ve learned, including the parts that don&apos;t usually make it into a portfolio. Our Community connects members who want to keep that conversation going beyond a single event.</p>
        <p>TTA isn&apos;t a firm, a school, or a credentialing body. It&apos;s a place to ask better questions, hear different answers, and figure out what kind of architect you actually want to be.</p>
      </div>
    </motion.div></section>
    <section className="border-y border-foreground/10"><div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32">
      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-16">What We Do</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><Pillar title="Think Sessions" description="Monthly conversations with architects, covering career, craft, and the decisions that shape both." /><Pillar title="Community" description="A WhatsApp space where members keep learning and connecting between sessions." /></div>
    </div></section>
    <section className="max-w-[1200px] mx-auto px-6 py-24 md:py-32"><div className="max-w-3xl">
      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8">Join Us</h2>
      <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed mb-10">Whether you&apos;re a student, a practicing architect, or somewhere in between, there&apos;s a seat here for you.</p>
      <Link href="/join" className="btn-primary inline-flex">Get Involved <span aria-hidden="true">→</span></Link>
    </div></section>
  </main>;
}

function Pillar({ title, description }: { title: string; description: string }) { return <article className="border border-foreground/10 p-8 md:p-12 bg-foreground/[0.02]"><h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-5">{title}</h3><p className="text-lg text-foreground/65 leading-relaxed">{description}</p></article>; }
