"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";
import { Send, Shield, Users, MessageSquare } from "lucide-react";
import CommunityTicker from "@/components/community/CommunityTicker";
import { CommunityHighlight } from "@/lib/community-data";

interface CommunityClientProps {
    highlights: CommunityHighlight[];
}

export default function CommunityClient({ highlights }: CommunityClientProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
    };

    return (
        <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1600px] w-full px-6 pt-40 pb-20 border-x border-foreground/5"
            >
                <div className="flex flex-col gap-6 max-w-4xl text-left">
                    <motion.span variants={itemVariants} className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Community</motion.span>
                    <motion.div variants={itemVariants}>
                        <h1 className="flex flex-wrap gap-x-4 md:gap-x-6 text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground">
                            <GlitchText as="span" text="COMMUNITY" />
                        </h1>
                    </motion.div>
                </div>
            </motion.section>

            {/* Dynamic Highlights Ticker */}
            {highlights.length > 0 && (
                <div className="w-full border-y border-foreground/5 py-10 bg-accent/5">
                    <div className="max-w-[1600px] mx-auto px-6 mb-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Live Intel // Recorded Highlights</span>
                    </div>
                    <CommunityTicker highlights={highlights} />
                </div>
            )}

            {/* Core Discourse Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-[1600px] w-full px-6 py-40 border-x border-t border-foreground/5 grid grid-cols-1 md:grid-cols-2 gap-20"
            >
                <motion.div variants={itemVariants} className="flex flex-col gap-8">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">A space for architects to think out loud, together.</h2>
                    <p className="text-xl text-foreground/50 leading-relaxed font-medium">
                        TTA&apos;s community lives on WhatsApp. It&apos;s where the conversation from Think Sessions keeps going, where members share work, ask questions, and figure things out with people who understand the field.
                    </p>
                    <a
                        href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary w-fit px-12 py-5 text-xl"
                    >
                        Join the WhatsApp Community <Send size={24} />
                    </a>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-12">
                    <CommunityFeature
                        icon={<Shield size={24} />}
                        label="What happens here"
                        detail="Members swap resources, talk through career decisions, and get first word on upcoming Think Sessions. No noise, no spam, just architects talking to architects."
                    />
                    <CommunityFeature
                        icon={<Users size={24} />}
                        label="Who it&apos;s for"
                        detail="Students, early-career architects, and anyone rethinking their practice. If you&apos;re figuring out where you fit in architecture, this is a good place to do it."
                    />
                    <CommunityFeature
                        icon={<MessageSquare size={24} />}
                        label="Stay connected"
                        detail="The conversation continues between sessions, with people who understand the field."
                    />
                </motion.div>
            </motion.section>

            {/* Call to Action */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-[1600px] w-full px-6 py-60 border-x border-t border-foreground/5 flex flex-col items-center justify-center bg-dot-pattern"
            >
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none text-foreground">THINK OUT LOUD. <br /> TOGETHER.</h2>
                    <p className="text-foreground/40 max-w-xl mx-auto mb-12 font-bold text-lg">
                        Join the community and keep the conversation going.
                    </p>
                    <a href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO" target="_blank" rel="noreferrer" className="btn-outline px-20 text-xl py-6">
                        Join the Community →
                    </a>
                </motion.div>
            </motion.section>
        </div>
    );
}

function CommunityFeature({ icon, label, detail }: { icon: React.ReactNode, label: string, detail: string }) {
    return (
        <div className="flex gap-8 group">
            <div className="w-16 h-16 bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0 group-hover:border-accent group-hover:bg-accent/5 transition-all">
                <div className="text-foreground/40 group-hover:text-accent transition-all">
                    {icon}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-accent transition-all text-foreground">{label}</h3>
                <p className="text-foreground/40 text-sm leading-relaxed max-w-sm">{detail}</p>
            </div>
        </div>
    );
}
