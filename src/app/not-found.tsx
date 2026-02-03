"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Terminal } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";

export default function NotFound() {
  const [decorElements, setDecorElements] = useState<{ x: number, duration: number, left: number }[]>([]);

  useEffect(() => {
    const elements = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      left: Math.random() * 100,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorElements(elements);
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern" />
        {decorElements.map((el, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, el.x, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: el.duration, repeat: Infinity }}
            className="absolute text-[10rem] font-black uppercase tracking-tighter whitespace-nowrap"
            style={{
              top: `${i * 5}%`,
              left: `${el.left}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            NOT FOUND // ACCESS DENIED // REDACTED
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-12 w-32 h-32 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent"
        >
          <ShieldAlert size={64} />
        </motion.div>

        <GlitchText
          as="h1"
          text="ACCESS RESTRICTED"
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
        />

        <div className="flex flex-col gap-6 mb-12">
          <p className="text-xl md:text-2xl text-foreground/50 font-medium leading-relaxed uppercase tracking-tight">
            The requested institutional record does not exist or has been moved to a high-clearance repository.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-accent animate-pulse">
            <Terminal size={14} /> System: Verification Failure / Code 404
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Link href="/" className="btn-primary flex-1 py-5 text-xl group">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Base
          </Link>
          <Link href="/programs" className="btn-outline flex-1 py-5 text-xl">
            Directory
          </Link>
        </div>
      </motion.div>

      {/* Frame Decors */}
      <div className="fixed top-12 left-12 border-l border-t border-accent/20 w-40 h-40 pointer-events-none" />
      <div className="fixed bottom-12 right-12 border-r border-b border-accent/20 w-40 h-40 pointer-events-none" />

      <div className="fixed top-12 right-12 text-[10px] font-black uppercase tracking-[0.5em] text-accent/40 rotate-90 origin-right translate-y-20">
        Structural Protocol Verification
      </div>
      <div className="fixed bottom-12 left-12 text-[10px] font-black uppercase tracking-[0.5em] text-accent/40 rotate-90 origin-left translate-y--20">
        Institutional Integrity Check
      </div>
    </div>
  );
}
