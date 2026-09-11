import CommunityJoinForm from "@/components/forms/CommunityJoinForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

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

                    {/* Right Column: Form */}
                    <div className="lg:col-span-7 lg:pl-12">
                        <CommunityJoinForm />
                    </div>

                </div>
            </div>
        </main>
    );
}
