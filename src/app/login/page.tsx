import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
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

                {/* Auth0-hosted sign-in */}
                <div className="bg-foreground/[0.02] border border-foreground/5 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/20" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-start gap-4 text-sm leading-relaxed text-foreground/60">
                            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent" />
                            <p>Sign in securely through Auth0. Your dashboard access is based on the role assigned to your account.</p>
                        </div>
                        <a
                            href="/auth/login?returnTo=%2Fdashboard"
                            className="mt-2 bg-foreground text-background py-5 px-8 font-black uppercase tracking-widest flex items-center justify-between hover:bg-accent hover:text-black transition-all group/btn"
                        >
                            Continue to secure login
                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </a>
                    </div>

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
