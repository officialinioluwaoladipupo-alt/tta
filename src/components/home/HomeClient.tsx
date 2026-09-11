"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GlitchText from "@/components/ui/GlitchText";
import Marquee from "@/components/ui/Marquee";
import { Asterisk, WavePattern, DottedLine } from "@/components/ui/DecorativeGraphics";
import JoinCommunityButton from "@/components/ui/JoinCommunityButton";
import { Event } from "@/lib/event-data";

import { CommunityHighlight } from "@/lib/community-data";
import CommunityTicker from "@/components/community/CommunityTicker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HomeClient({ marqueeText, highlights = [], upcomingEvents = [] }: { marqueeText: string, highlights?: CommunityHighlight[], upcomingEvents?: Event[] }) {
  const currentYear = new Date().getFullYear().toString();
  const processedMarquee = marqueeText.replace(/<CurrentYear \/>/g, currentYear);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden border-b border-foreground/5">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale saturate-0 contrast-125 opacity-10" />
        </motion.div>

        {/* Decorative Graphics */}
        <div className="absolute top-20 left-20 z-10 opacity-20 hidden lg:block">
          <Asterisk color="var(--accent)" className="w-32 h-32" />
        </div>
        <div className="absolute top-20 right-20 z-10 opacity-20 hidden lg:block">
          <WavePattern color="var(--accent)" />
        </div>
        <div className="absolute bottom-40 left-10 z-10 opacity-10 hidden lg:block">
          <DottedLine color="var(--accent)" className="rotate-45" />
        </div>
        <div className="absolute bottom-20 right-40 z-10 opacity-20 hidden lg:block">
          <Asterisk color="var(--accent)" className="w-20 h-20" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 flex flex-col items-center max-w-6xl"
        >


          <motion.div variants={itemVariants}>
            <GlitchText
              as="h1"
              text="ARCHITECTURAL THINKING, BUILT TO LAST."
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] mb-8 tracking-tighter text-foreground"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-foreground/60 max-w-2xl mb-6 font-medium tracking-tight"
          >
            The Thinking Architect is a community for architects and architecture students who want more than a degree: real conversations, real mentorship, and the judgment that carries a practice past school and past trends.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-foreground/50 max-w-2xl mb-12"
          >
            Built by architects, for architects.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <Link href="/join" className="btn-primary text-xl px-12 py-5 group">
              Join the Community <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
            <Link href="/events" className="btn-outline text-xl px-12 py-5">
              See Upcoming Think Session
            </Link>
          </motion.div>
        </motion.div>


        {/* Floating Detail Elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-1 border-l-2 border-accent pl-4"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Status</span>
          <span className="text-xs font-bold uppercase text-foreground">System: Operational</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-1 border-r-2 border-foreground/20 pr-4"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location</span>
          <span className="text-xs font-bold uppercase text-foreground">Global Foundation / <span className="font-logo">TTA</span></span>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Marquee text={processedMarquee} className="bg-accent/5 text-accent border-y border-accent/10" repeat={4} speed={40} />
      </motion.div>

      <section className="max-w-[1600px] mx-auto w-full px-6 py-20 lg:py-32 border-x border-foreground/5">
        <div className="grid gap-8 lg:grid-cols-[0.35fr_1fr] items-start">
          <p className="text-[11px] font-black uppercase tracking-widest text-accent">Up Next</p>
          <div className="relative flex flex-col gap-6 border border-foreground/10 bg-foreground/[0.03] p-8 md:p-12 lg:p-16 shadow-[8px_8px_0_var(--accent)]">
          {upcomingEvents[0] ? (
            <>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{upcomingEvents[0].title}</h2>
              <p className="text-lg text-foreground/60">{upcomingEvents[0].speakers?.map((speaker) => speaker.name).join(", ") || "Think Sessions"} · {upcomingEvents[0].displayDate}</p>
              <p className="max-w-2xl text-foreground/70">{upcomingEvents[0].shortDescription || upcomingEvents[0].description}</p>
              <a href={upcomingEvents[0].link || `/events/${upcomingEvents[0].slug}`} target={upcomingEvents[0].link ? "_blank" : undefined} rel={upcomingEvents[0].link ? "noreferrer" : undefined} className="btn-primary self-start">Reserve Your Spot <ArrowRight size={18} /></a>
            </>
          ) : (
            <p className="text-2xl font-bold tracking-tight">No session scheduled yet, check back soon.</p>
          )}
          </div>
        </div>
      </section>

      {/* Focus Area Grid */}
      <section className="max-w-[1600px] mx-auto w-full px-6 py-20 lg:py-40 border-x border-foreground/5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <FocusCard
            number="01"
            title="Think Sessions"
            description="Monthly conversations with architects and professionals who've built careers on more than a portfolio."
          />
          <FocusCard
            number="02"
            title="Community"
            description="A WhatsApp home where architects ask real questions, share real work, and find the people who've been where they are."
          />
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 lg:py-40 flex flex-col items-center justify-center text-center bg-dot-pattern border-y border-foreground/5 relative overflow-hidden">
        {/* Decorative Graphics */}
        <div className="absolute top-10 right-10 opacity-10 hidden lg:block">
          <Asterisk color="var(--accent)" className="w-64 h-64" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10 hidden lg:block">
          <WavePattern color="var(--accent)" />
        </div>

        {/* Community Highlights Insert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative z-30 mb-20"
        >
          <CommunityTicker highlights={highlights} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl px-6 relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-none text-foreground">
            THIS IS BIGGER THAN <span className="text-accent underline decoration-4 underline-offset-8">ONE CONVERSATION.</span>
          </h2>
          <p className="text-xl text-foreground/60 mb-12 max-w-2xl mx-auto font-medium">
            TTA exists so no architect has to build their thinking alone. Join a community working toward something that outlasts a single career.
          </p>
          <div className="flex justify-center w-full">
            <JoinCommunityButton />
          </div>
        </motion.div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-full h-full border-100 border-accent/10 rounded-full"
          />
        </div>
      </section>
    </div>
  );
}

function FocusCard({ number, title, description, border = true, highlight = false }: { number: string, title: string, description: string, border?: boolean, highlight?: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ backgroundColor: "rgba(232, 93, 63, 0.03)" }}
      className={`p-8 md:p-12 lg:p-16 flex flex-col gap-10 transition-colors group ${border ? 'border-b lg:border-r border-foreground/5' : ''} ${highlight ? 'bg-accent/5' : ''}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-4xl font-black text-foreground/10 group-hover:text-accent transition-all leading-none">{number}</span>
        {highlight && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-accent" />}
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight text-foreground group-hover:text-accent transition-all">{title}</h3>
        <motion.p
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          className="text-foreground/70 leading-relaxed font-medium"
        >
          {description}
        </motion.p>
      </div>
      <Link href="#" className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
        Explore Detail <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
