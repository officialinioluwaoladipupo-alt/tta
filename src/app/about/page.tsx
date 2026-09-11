"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";
import TeamSection from "@/components/about/TeamSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function About() {
  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
      <section className="max-w-[1600px] w-full px-6 pt-28 lg:pt-40 pb-20 border-x border-foreground/5">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-6 max-w-4xl"
        >
          <motion.span 
            variants={itemVariants} 
            className="text-[11px] font-black uppercase tracking-[0.3em] text-accent"
          >
            Section 01 / Information
          </motion.span>
          <motion.div variants={itemVariants}>
            <GlitchText 
              as="h1" 
              text="THE ARCHITECTURAL FOUNDATION" 
              className="text-4xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground mb-8" 
            />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-12 max-w-2xl">
              The Thinking Architect (TTA) is a global architectural platform dedicated to the cultivation of professional architectural thinking.
            </h2>
            <div className="flex flex-col gap-8 text-xl text-foreground/60 max-w-3xl leading-relaxed font-medium">
              <p>
                We exist to strengthen the intellectual, operational, and conceptual foundations that govern architectural practice — beyond school, beyond trends, and beyond short-term relevance.
              </p>
              <p>
                TTA operates through curated talks, focused sessions, and long-horizon programs that address how architects think, decide, and practice under real conditions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-[1600px] w-full px-6 py-20 border-x border-t border-foreground/5 grid grid-cols-1 lg:grid-cols-2 gap-20"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">Mission Objective</h2>
          <div className="flex flex-col gap-6 text-lg text-foreground/60 leading-relaxed font-medium">
            <p>
              Our mission is to establish and preserve architectural clarity in an increasingly accelerated and noisy professional landscape.
            </p>
            <p>
              TTA provides a structured environment where architectural thinking is examined, refined, and reinforced — ensuring that decisions, systems, and practice are grounded in durable principles rather than reactive behavior.
            </p>
            <div className="flex flex-col gap-2 border-l-2 border-accent/50 pl-6 py-2 my-4">
              <span className="text-foreground font-bold">We do not aim for scale through simplification.</span>
              <span className="text-foreground font-bold">We aim for depth through structure.</span>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">Core Philosophy</h2>
          <div className="space-y-6">
             <PhilosophyItem 
               label="CALM" 
               detail="Architectural thinking requires space. Our interfaces, sessions, and discourse are designed to reduce cognitive noise and allow ideas to be properly examined." 
             />
             <PhilosophyItem 
               label="INTENTIONAL" 
               detail="Nothing within TTA is accidental. Every program, session, and conversation exists for a defined architectural purpose." 
             />
             <PhilosophyItem 
               label="DURABLE" 
               detail="Architecture is a long game. TTA is built on foundations meant to outlast trends, cycles, and temporary professional incentives." 
             />
          </div>
        </motion.div>
      </motion.section>

      <section className="max-w-[1600px] w-full px-6 py-40 border-x border-t border-foreground/5 bg-dot-pattern">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-8"
          >
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Institutional Stability</h2>
            <div className="flex flex-col gap-6 text-lg text-foreground/60 leading-relaxed font-medium">
              <p className="text-xl text-foreground font-bold">TTA is not a startup. It is an institution.</p>
              <ul className="flex flex-col gap-4 border-l-2 border-foreground/10 pl-6">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Durability over speed
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Intention over visibility
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Structure over spontaneity
                </li>
              </ul>
              <p>
                Our build philosophy is centered on the systems of thought that sustain architectural practice at its most responsible and professional levels.
              </p>
              <p className="italic text-foreground/40">
                TTA is designed to mature, not pivot — and to remain coherent as the profession evolves.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col gap-8 lg:pl-20 lg:border-l border-foreground/5"
          >
             <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Position</h2>
             <div className="flex flex-col gap-6 text-lg text-foreground/60 leading-relaxed font-medium">
                <div className="flex flex-col gap-2">
                   <p>The Thinking Architect is not a content platform.</p>
                   <p>It is not a school.</p>
                   <p>It is not a social network.</p>
                </div>
                <p className="text-2xl text-foreground font-bold mt-4 leading-tight">
                   It is a foundation — for architects who recognize that practice is governed first by how one thinks.
                </p>
             </div>
          </motion.div>
        </div>
      </section>
      <TeamSection />
    </div>
  );
}

function PhilosophyItem({ label, detail }: { label: string, detail: string }) {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col gap-3 border-l-2 border-accent pl-6 py-4 hover:bg-foreground/5 transition-colors cursor-default group"
    >
      <span className="text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">{label}</span>
      <span className="text-foreground/60 text-base leading-relaxed max-w-md">{detail}</span>
    </motion.div>
  );
}
