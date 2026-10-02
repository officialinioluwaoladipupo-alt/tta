"use client";

import GlitchText from "@/components/ui/GlitchText";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProgramLayout({ 
  children, 
  title, 
  label, 
  icon: Icon
}: { 
  children: React.ReactNode, 
  title: string, 
  label: string,
  icon?: React.ElementType
}) {
  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
      <section className="max-w-[1600px] w-full px-6 pt-40 pb-20 border-x border-foreground/5">
        <Link href="/programs" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-accent mb-20 transition-all">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>
        
        <div className="flex flex-col gap-6 max-w-6xl">
           <div className="flex items-center gap-4">
              {Icon && (
                <span className="p-2 border border-accent bg-accent/10">
                   <Icon size={24} className="text-accent" />
                </span>
              )}
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">{label}</span>
           </div>
           <GlitchText as="h1" text={title} className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter text-foreground" />
        </div>
      </section>

      {children}
    </div>
  );
}
