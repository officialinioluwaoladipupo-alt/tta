import { ArrowLeft, ArrowRight, MoveUpRight, UsersRound } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import TallyPopupButton from "@/components/ui/TallyPopupButton";

export const metadata: Metadata = {
    title: "Join the Community - The Thinking Architect",
    description: "A space for architecture students and young professionals who want more than motivation posts and pretty renders.",
};

export default function JoinPage() {
    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-20">
            <div className="max-w-[1600px] mx-auto px-6">
                {/* Back Link */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Copy - Sticky on Desktop */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                            Join the <span className="text-accent">Community</span>.
                        </h1>

                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-medium max-w-xl mb-12">
                            A space for architecture students and young professionals who want more than motivation posts and pretty renders.
                        </p>

                        <div className="space-y-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-accent border-b border-accent/20 pb-4 inline-block">
                                What you&apos;ll get
                            </h3>

                            <ul className="space-y-4">
                                {[
                                    "Access to our private WhatsApp community",
                                    "Monthly events with practicing architects",
                                    "Resources, guides, and tools",
                                    "Honest conversations about school and practice"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-foreground/80 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Open Tally's dark popup form, matching the supplied reference. */}
                    <div className="lg:col-span-7 lg:pl-12 flex items-start lg:pt-20">
                        <TallyPopupButton className="group relative w-full max-w-2xl overflow-hidden border border-[#2b2b2b]/15 bg-[#ebe7e1] p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_70px_rgba(43,43,43,0.12)] sm:p-10">
                            <span className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-accent/20 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                            <span className="absolute -right-1 top-8 h-32 w-32 rounded-full border border-accent/20 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                            <span className="relative flex items-center justify-between gap-6">
                                <span>
                                    <span className="mb-8 flex h-12 w-12 items-center justify-center bg-accent text-white">
                                        <UsersRound size={22} strokeWidth={1.8} />
                                    </span>
                                    <span className="block text-xs font-black uppercase tracking-[0.2em] text-accent">Your next conversation starts here</span>
                                    <span className="mt-3 block max-w-md text-3xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">Pull up a seat.</span>
                                    <span className="mt-4 block text-sm font-medium text-foreground/60">A thoughtful community for the people shaping architecture.</span>
                                </span>
                                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-foreground" aria-hidden="true">
                                    <MoveUpRight size={24} />
                                </span>
                            </span>
                            <span className="relative mt-8 flex items-center gap-3 border-t border-foreground/10 pt-5 text-xs font-black uppercase tracking-[0.18em] text-foreground/55">
                                Open the join form <ArrowRight size={15} className="text-accent transition-transform group-hover:translate-x-2" />
                            </span>
                        </TallyPopupButton>
                    </div>

                </div>
            </div>
        </main>
    );
}
