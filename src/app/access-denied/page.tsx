import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Dashboard access required | The Thinking Architect",
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-5 py-20 text-foreground sm:px-8">
      <section className="w-full max-w-xl border border-foreground/10 bg-foreground/[0.02] p-7 sm:p-10">
        <ShieldAlert className="mb-5 text-accent" size={34} aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Sign-in complete</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Dashboard access isn&apos;t assigned yet.</h1>
        <p className="mt-5 leading-relaxed text-foreground/70">
          Your account signed in, but it doesn&apos;t currently have a verified email and dashboard permission. Ask a TTA administrator to verify your Auth0 account and assign the appropriate dashboard role, then sign out and back in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/auth/logout?returnTo=%2Flogin" className="btn-primary min-h-11 px-5">Sign out</a>
          <Link href="/" className="btn-outline min-h-11 px-5">Back to website</Link>
        </div>
      </section>
    </main>
  );
}
