"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/dashboard/ImageUpload";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/cms-actions";

type Member = { id: string; name: string; role: string; bio: string; photoUrl?: string; sortOrder?: number; isVisible?: boolean };

export default function TeamAdmin({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<Member | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [message, setMessage] = useState("");
  const start = (member?: Member) => { setEditing(member || { id: "", name: "", role: "", bio: "", isVisible: true }); setPhotoUrl(member?.photoUrl); setMessage(""); };
  const save = async (formData: FormData) => {
    const data = { name: String(formData.get("name") || ""), role: String(formData.get("role") || ""), bio: String(formData.get("bio") || ""), photoUrl, sortOrder: Number(formData.get("sortOrder") || 0), isVisible: formData.get("isVisible") === "on" };
    const result = editing?.id ? await updateTeamMember(editing.id, data) : await createTeamMember(data);
    if (result.success) { setMessage("Team member saved."); window.location.reload(); } else setMessage(result.error || "Save failed.");
  };
  return <main className="min-h-screen bg-background pt-32 pb-20 px-6"><div className="max-w-5xl mx-auto"><Link href="/dashboard" className="text-xs uppercase tracking-widest text-foreground/50">← Dashboard</Link><div className="flex justify-between items-end mt-10 mb-10"><div><p className="text-accent text-xs font-black uppercase tracking-widest">CMS / Team</p><h1 className="text-6xl font-black uppercase tracking-tighter">Team</h1></div><button onClick={() => start()} className="btn-primary">Add Member</button></div>{message && <p className="mb-6 text-accent font-bold">{message}</p>}<div className="grid gap-4">{members.map((member) => <div key={member.id} className="border border-foreground/10 p-6 flex items-center gap-6"><div className="w-20 h-20 rounded-full overflow-hidden bg-foreground/5">{member.photoUrl && <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />}</div><div className="flex-1"><h2 className="font-black uppercase">{member.name}</h2><p className="text-sm text-foreground/60">{member.role}</p></div><button onClick={() => start(member)} className="btn-outline">Edit</button><button onClick={async () => { if (confirm("Delete this team member?")) { await deleteTeamMember(member.id); window.location.reload(); } }} className="text-red-500 text-xs font-bold uppercase">Delete</button></div>)}</div>{editing && <form action={save} className="mt-12 grid gap-6 border border-accent/30 p-8"><input name="name" defaultValue={editing.name} required placeholder="Name" className="p-4 bg-foreground/5" /><input name="role" defaultValue={editing.role} required placeholder="Role" className="p-4 bg-foreground/5" /><textarea name="bio" defaultValue={editing.bio} placeholder="Bio" rows={4} className="p-4 bg-foreground/5" /><input name="sortOrder" type="number" defaultValue={editing.sortOrder || 0} placeholder="Order" className="p-4 bg-foreground/5" /><ImageUpload label="Team photo (Cloudinary)" currentImage={photoUrl} onUploadComplete={setPhotoUrl} /><label className="flex gap-2 items-center"><input name="isVisible" type="checkbox" defaultChecked={editing.isVisible ?? true} /> Visible publicly</label><div className="flex gap-4"><button className="btn-primary">Save Member</button><button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button></div></form>}</div></main>;
}
