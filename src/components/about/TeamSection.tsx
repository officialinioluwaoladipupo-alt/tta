"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Member = { id: string; name: string; role: string; bio: string; photoUrl?: string };

export default function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => { fetch("/api/team").then((response) => response.ok ? response.json() : []).then(setMembers).catch(() => setMembers([])); }, []);
  if (!members.length) return null;
  return <section className="max-w-[1600px] w-full px-6 py-32 border-x border-t border-foreground/5"><p className="text-accent text-xs font-black uppercase tracking-widest mb-6">The people building TTA</p><h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16">Our Team</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{members.map((member) => <article key={member.id} className="border border-foreground/10 p-6"><div className="aspect-square bg-foreground/5 mb-6 overflow-hidden relative">{member.photoUrl && <Image src={member.photoUrl} alt={member.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}</div><h3 className="text-2xl font-black uppercase">{member.name}</h3><p className="text-accent text-xs font-bold uppercase tracking-widest mt-2">{member.role}</p><p className="text-foreground/60 mt-4">{member.bio}</p></article>)}</div></section>;
}
