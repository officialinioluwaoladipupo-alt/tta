"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Send, Globe, Instagram, Twitter } from "lucide-react";

export default function Footer({ settings }: { settings?: Record<string, unknown> }) {
  const siteName = settings?.siteName || "THE THINKING ARCHITECT";
  const footerMarqueeText = settings?.footerMarqueeText || settings?.siteName || "TTA";
  return (
    <footer className="bg-background text-foreground relative overflow-hidden border-t border-dark/5">
      <div className="absolute top-10 left-0 w-full opacity-[0.05] select-none pointer-events-none flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex shrink-0 items-center"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-[20rem] font-black uppercase tracking-tighter mx-20 flex items-center gap-20 font-logo">
              {footerMarqueeText}
              <div className="w-12 h-12 rounded-full bg-foreground/10" />
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto pt-20 lg:pt-32 pb-20 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-none">
              {siteName.split(' ').map((word: string, i: number) => (
                <span key={i}>{word} <br /></span>
              ))}
            </h2>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={20} />} href="#" />
              <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/_tta.ng/" />
              <SocialIcon icon={<Send size={20} />} href="https://t.me/thethinkingarchitect" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:col-span-2 gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/50">Navigation</h3>
              <ul className="flex flex-col gap-2">
                <FooterLink href="/media">Media</FooterLink>
                <FooterLink href="/sessions">Sessions</FooterLink>
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/tickets">Tickets</FooterLink>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/50">Platforms</h3>
              <ul className="flex flex-col gap-2">
                <FooterLink href="https://t.me/thethinkingarchitect">Telegram</FooterLink>
                <FooterLink href="https://luma.com/calendar/cal-zMvRPq81i5pG0LL">Luma</FooterLink>
                <FooterLink href="https://www.youtube.com/@TheThinkingArchitect-t4p">YouTube</FooterLink>
                <FooterLink href="https://www.instagram.com/_tta.ng/">Instagram</FooterLink>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/50">Foundation</h3>
              <ul className="flex flex-col gap-2">
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-40 border-t border-foreground/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-[10px] font-black uppercase tracking-widest text-foreground/40">
            <span>Established January 2026</span>
            <div className="flex items-center gap-2">
              <Globe size={14} /> Global Foundation
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <li>
      <Link href={href} className="text-base font-bold uppercase tracking-tighter hover:bg-foreground hover:text-background transition-all px-2 -mx-2 inline-block">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="w-12 h-12 bg-white flex items-center justify-center hover:bg-accent hover:text-white transition-all border border-foreground/5">
      {icon}
    </Link>
  );
}
