"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import type { Speaker } from "@/lib/event-data";
import { reorderSpeakers } from "@/lib/speaker-data";

const blankSpeaker = (): Speaker => ({ id: crypto.randomUUID(), name: "", role: "", title: "", organization: "", topic: "", bio: "", avatar: "" });

export default function SpeakerEditor({ initialValue }: { initialValue?: string | Speaker[] }) {
  const parse = (): Speaker[] => {
    if (Array.isArray(initialValue)) return initialValue;
    if (typeof initialValue === "string") {
      try { const parsed = JSON.parse(initialValue); return Array.isArray(parsed) ? parsed : [blankSpeaker()]; } catch { return [blankSpeaker()]; }
    }
    return [blankSpeaker()];
  };
  const [speakers, setSpeakers] = useState<Speaker[]>(parse);
  const update = (index: number, key: keyof Speaker, value: string) => setSpeakers((items) => items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const move = (index: number, direction: -1 | 1) => setSpeakers((items) => {
    const next = index + direction;
    if (next < 0 || next >= items.length) return items;
    return reorderSpeakers(items, index, next);
  });
  return <div className="col-span-2 space-y-4">
    <input type="hidden" name="speakers" value={JSON.stringify(speakers)} readOnly />
    <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase tracking-widest opacity-40">Speakers</label><button type="button" onClick={() => setSpeakers((items) => [...items, blankSpeaker()])} className="btn-outline px-3 py-2 text-xs"><Plus size={14} /> Add speaker</button></div>
    {speakers.map((speaker, index) => <div key={speaker.id || index} className="border border-foreground/10 p-5 grid gap-4 md:grid-cols-[1fr_180px]">
      <div className="grid gap-3 md:grid-cols-2">
        {([['name', 'Name'], ['title', 'Role / title'], ['organization', 'Organization'], ['topic', 'Topic']] as const).map(([key, label]) => <input key={key} value={speaker[key] || ""} onChange={(event) => update(index, key, event.target.value)} placeholder={label} className="p-3 bg-foreground/[0.03] border border-foreground/10" />)}
        <textarea value={speaker.bio || ""} onChange={(event) => update(index, "bio", event.target.value)} placeholder="Bio" rows={3} className="p-3 bg-foreground/[0.03] border border-foreground/10 md:col-span-2" />
        <input value={speaker.role || speaker.title || ""} onChange={(event) => update(index, "role", event.target.value)} placeholder="Legacy role label (optional)" className="p-3 bg-foreground/[0.03] border border-foreground/10 md:col-span-2" />
      </div>
      <div className="space-y-3"><ImageUpload label="Speaker photo" entityType="speaker" currentImage={speaker.avatar} onUploadComplete={(url, publicId) => setSpeakers((items) => items.map((item, i) => i === index ? { ...item, avatar: url, publicId } : item))} /><div className="flex gap-2"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="btn-outline p-2 disabled:opacity-30"><ArrowUp size={14} /></button><button type="button" disabled={index === speakers.length - 1} onClick={() => move(index, 1)} className="btn-outline p-2 disabled:opacity-30"><ArrowDown size={14} /></button><button type="button" onClick={() => setSpeakers((items) => items.filter((_, i) => i !== index))} className="text-red-500 p-2"><Trash2 size={16} /></button></div></div>
    </div>)}
  </div>;
}
