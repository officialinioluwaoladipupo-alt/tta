"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MessageSquare, Users, Clock, ShieldCheck, Instagram, Twitter, Linkedin, Youtube, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CommunityTicker from "@/components/community/CommunityTicker";
import { CommunityHighlight } from "@/lib/community-data";

const WHATSAPP_LINK = "https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO";

const groundRules = [
  "Be useful.",
  "Be kind.",
  "Stay on topic.",
  "Share what you know. Don't gatekeep.",
];

const socials = [
  { name: "Instagram", handle: "@_tta.ng", href: "https://instagram.com/_tta.ng", icon: Instagram },
  { name: "X (Twitter)", handle: "@TTA_Africa", href: "https://x.com/TTA_Africa", icon: Twitter },
  { name: "LinkedIn", handle: "The Thinking Architect", href: "https://www.linkedin.com/company/thethinkingarchitects", icon: Linkedin },
  { name: "YouTube", handle: "@TheThinkingArchitect-t4p", href: "https://www.youtube.com/@TheThinkingArchitect-t4p", icon: Youtube },
];

interface CommunityClientProps {
  highlights: CommunityHighlight[];
}

export default function CommunityClient({ highlights }: CommunityClientProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      await fetch("/api/newsletter", { method: "POST", body: formData });
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      console.error("Newsletter submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
      {/* 1. Hero / Header & Intro */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1600px] w-full px-6 pt-36 pb-20 border-x border-foreground/5"
      >
        <div className="flex flex-col gap-6 max-w-5xl text-left">
          <motion.span variants={itemVariants} className="text-xs font-black uppercase tracking-[0.24em] text-accent">
            The Thinking Architect · Community
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-[9.5rem] font-black uppercase tracking-tighter leading-[0.82] text-foreground">
            Keep the<br />conversation<br className="hidden sm:block" /> going<span className="text-accent">.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-3xl text-xl md:text-2xl font-medium leading-relaxed text-foreground/70">
            TTA&apos;s community lives on WhatsApp. It&apos;s where the conversation from Think Sessions carries on: members share work, ask questions and work things out with people who understand the field.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-primary min-h-16 px-10 text-base"
            >
              Join on WhatsApp <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Ticker (if highlights exist) */}
      {highlights.length > 0 && (
        <div className="w-full border-y border-foreground/5 py-8 bg-accent/5">
          <div className="max-w-[1600px] mx-auto px-6 mb-6">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Live Intel // Recorded Highlights</span>
          </div>
          <CommunityTicker highlights={highlights} />
        </div>
      )}

      {/* 2. Three Pillars: What happens here / Who it's for / Between sessions */}
      <section className="max-w-[1600px] w-full px-6 py-24 border-x border-t border-foreground/5">
        <div className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent mb-2">Inside the space</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
            Built for real exchange<span className="text-accent">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-foreground/10">
          {/* What happens here */}
          <article className="border-r border-b border-foreground/10 p-8 md:p-10 flex flex-col justify-between hover:bg-accent/[0.02] transition-colors">
            <div>
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-8">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
                What happens here
              </h3>
              <p className="text-base leading-relaxed text-foreground/65 font-medium">
                Members swap resources, talk through career decisions and hear about Think Sessions first. The conversation stays useful, and it stays on architecture.
              </p>
            </div>
          </article>

          {/* Who it's for */}
          <article className="border-r border-b border-foreground/10 p-8 md:p-10 flex flex-col justify-between hover:bg-accent/[0.02] transition-colors">
            <div>
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-8">
                <Users size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
                Who it&apos;s for
              </h3>
              <p className="text-base leading-relaxed text-foreground/65 font-medium">
                Students, early-career and practising architects, educators, and others in the built environment. If you want honest conversation about how places get made, there is a place for you.
              </p>
            </div>
          </article>

          {/* Between sessions */}
          <article className="border-r border-b border-foreground/10 p-8 md:p-10 flex flex-col justify-between hover:bg-accent/[0.02] transition-colors">
            <div>
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-8">
                <Clock size={22} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
                Between sessions
              </h3>
              <p className="text-base leading-relaxed text-foreground/65 font-medium">
                Questions, resources and honest advice keep moving after the session ends. You don&apos;t need to wait for the next one to ask something.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Ground rules */}
      <section className="max-w-[1600px] w-full px-6 py-24 border-x border-t border-foreground/5 bg-foreground/[0.02]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-accent">
              <ShieldCheck size={16} /> Community Standard
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-[0.9]">
              Ground rules<span className="text-accent">.</span>
            </h2>
            <p className="text-base leading-relaxed text-foreground/60">
              Our standards are simple to maintain a constructive, respectful environment for everyone.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groundRules.map((rule, idx) => (
              <div
                key={rule}
                className="p-6 md:p-8 border border-foreground/10 bg-background flex flex-col gap-3 justify-between"
              >
                <span className="text-xs font-black text-accent tracking-widest">0{idx + 1} / RULE</span>
                <p className="text-xl font-black uppercase tracking-tight text-foreground">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Events */}
      <section className="max-w-[1600px] w-full px-6 py-24 border-x border-t border-foreground/5">
        <div className="border border-foreground/10 bg-[#ebe7e1] p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent mb-3">Think Sessions</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
              Never miss a session<span className="text-accent">.</span>
            </h2>
            <p className="text-lg leading-relaxed text-foreground/70 font-medium">
              RSVP on Luma for the link and a reminder before each Think Session.
            </p>
          </div>
          <Link
            href="/events"
            className="btn-primary min-h-14 px-8 text-sm whitespace-nowrap self-start md:self-center"
          >
            See upcoming sessions <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 5. Follow along */}
      <section className="max-w-[1600px] w-full px-6 py-24 border-x border-t border-foreground/5">
        <div className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent mb-2">Social Channels</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
            Find us elsewhere<span className="text-accent">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group p-8 border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between min-h-48 hover:border-accent hover:bg-accent/[0.03] transition-all"
              >
                <div className="flex items-center justify-between text-foreground/40 group-hover:text-accent transition-colors">
                  <Icon size={24} />
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
                    {social.name}
                  </h3>
                  <p className="text-xs font-mono text-foreground/50 mt-1">
                    {social.handle}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 6. Newsletter */}
      <section className="max-w-[1600px] w-full px-6 py-20 border-x border-t border-foreground/5 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Mail size={40} className="text-accent mb-6" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Newsletter<span className="text-accent">.</span>
          </h2>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground/70 mb-8">
            New stories, conversations and session dates, first.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-3 bg-accent/20 border border-accent text-accent px-6 py-4 rounded-md font-bold uppercase text-sm">
              <CheckCircle2 size={20} /> You are subscribed. Thank you!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent text-sm font-medium"
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary min-h-12 px-8 text-sm whitespace-nowrap"
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="w-full max-w-[1600px] px-6 py-28 border-x border-t border-b border-foreground/5 bg-foreground text-background text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-background mb-6">
          There is a seat for you<span className="text-accent">.</span>
        </h2>
        <p className="max-w-2xl text-xl md:text-2xl font-medium leading-relaxed text-background/70 mb-10">
          Join the WhatsApp community and bring the question you are carrying.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="btn-primary min-h-16 px-12 text-base"
        >
          Join on WhatsApp <ArrowRight size={20} />
        </a>
      </section>
    </div>
  );
}
