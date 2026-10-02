"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Box, Layers } from "lucide-react";

interface ProgramListItem { slug: string; title: string; status: string; featured?: boolean; description?: string }

export default function ProgramListClient({ programs }: { programs: ProgramListItem[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const getProgramIcon = (title: string, featured: boolean) => {
    if (featured) return <Lock size={32} />;
    if (title.includes("CORE")) return <Box size={32} />;
    return <Layers size={32} />;
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-[1600px] w-full px-6 py-20 border-x border-t border-foreground/5 grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/5"
    >
      {programs.map((program, i) => (
        <motion.div 
          key={program.slug}
          variants={itemVariants}
          className={`relative p-12 lg:p-20 flex flex-col gap-12 bg-background group overflow-hidden ${program.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
        >
          {/* Background Highlight */}
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
          
          {/* Corner Decors */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-foreground/10 group-hover:border-accent transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-foreground/10 group-hover:border-accent transition-colors" />

          {/* Header */}
          <div className="relative z-10 flex justify-between items-start">
             <div className="p-4 bg-foreground/5 text-foreground/40 group-hover:text-accent group-hover:bg-accent/10 transition-all rounded-sm">
                {getProgramIcon(program.title, Boolean(program.featured))}
             </div>
             <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border ${program.featured ? 'border-accent text-accent bg-accent/5' : 'border-foreground/10 text-foreground/40'}`}>
                {program.status}
             </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 mt-auto">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-foreground leading-[0.85] group-hover:translate-x-2 transition-transform duration-500">
                {program.title?.replace(/<CurrentYear \/>/g, new Date().getFullYear().toString()).split("//")[0]}
                {program.featured && <span className="block text-accent text-2xl md:text-3xl mt-2 tracking-widest font-bold">RESTRICTED ACCESS</span>}
             </h2>
             <p className="text-foreground/50 font-medium leading-relaxed max-w-lg text-lg group-hover:text-foreground/70 transition-colors">
                {program.description?.replace(/<CurrentYear \/>/g, new Date().getFullYear().toString()) || "A rigorous architectural intensive designed for professional durability and operational mastery."}
             </p>
          </div>

          {/* Action */}
          <div className="relative z-10 pt-12 border-t border-foreground/5 mt-8 flex items-center justify-between">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors">
                Sequence {i + 1 < 10 ? `0${i + 1}` : i + 1}
             </span>
             <Link 
               href={`/programs/${program.slug}`}
               className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors"
             >
               Initiate Protocol <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
