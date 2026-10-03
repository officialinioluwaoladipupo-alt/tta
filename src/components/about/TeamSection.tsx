import Image from "next/image";
import type { TeamMember } from "@/lib/team-data";

export default function TeamSection({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;

  return (
    <section className="border-y border-foreground/10 bg-[#ebe7e1]">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.22em] text-accent">The people behind TTA</p>
        <h2 className="mb-12 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:mb-16 md:text-7xl">Meet the team.</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="border border-foreground/10 bg-background p-5 sm:p-6">
              <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-foreground/5">
                {member.photoUrl ? (
                  <Image src={member.photoUrl} alt={member.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-7xl font-black text-accent/70" aria-hidden="true">
                    {member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black uppercase leading-tight tracking-tight">{member.name}</h3>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-accent">{member.role}</p>
              {member.bio && <p className="mt-4 leading-relaxed text-foreground/65">{member.bio}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
