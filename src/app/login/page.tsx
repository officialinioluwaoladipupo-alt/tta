"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Use window.location for a full reload to ensure middleware catches the new session cookie
            window.location.href = "/dashboard";
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background">
            <div className="w-full max-w-md">
                {/* Logo/Branding */}
                <div className="mb-12 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Central Command // TTA</span>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground leading-none">
                        Registry <br /> ACCESS
                    </h1>
                </div>

                {/* Login Form */}
                <div className="bg-foreground/[0.02] border border-foreground/5 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/20" />

                    <form onSubmit={handleLogin} className="flex flex-col gap-6 relative z-10">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wider">
                                <ShieldAlert size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Institutional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@thethinkingarchitect.com"
                                    required
                                    className="w-full bg-foreground/[0.03] border border-foreground/10 py-4 pl-12 pr-4 text-foreground focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Access Passcode</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-foreground/[0.03] border border-foreground/10 py-4 pl-12 pr-4 text-foreground focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all font-medium font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 bg-foreground text-background py-5 px-8 font-black uppercase tracking-widest flex items-center justify-between hover:bg-accent hover:text-black transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Authorizing..." : "Initiate Login"}
                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </button>
                    </form>

                    {/* Decorative Corner */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-accent/5 -z-0 rotate-45 translate-x-8 translate-y-8" />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                        Unauthorized access to TTA Registry is logged for security.
                    </p>
                </div>
            </div>
        </main>
    );
}
