"use client";

import { useState } from "react";
import { Users, PlusCircle, Sparkles, Download, Calendar, LogOut, Trash2, Edit3 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import {
    createAirtableEvent,
    updateAirtableEvent,
    deleteAirtableEvent,
    createAirtableHighlight,
    updateAirtableHighlight,
    deleteAirtableHighlight
} from "@/lib/cms-actions";
import ImageUpload from "@/components/dashboard/ImageUpload";
import {
    AirtableRecord,
    AirtableEventFields,
    AirtableHighlightFields,
    EventFormData,
    HighlightFormData
} from "@/lib/cms-types";

// Helper type for union of record types
type DashboardRecord = AirtableRecord<AirtableEventFields> | AirtableRecord<AirtableHighlightFields>;

interface Props {
    initialSubmissions: Record<string, unknown>[]; // Submissions are from Supabase
    initialEvents: AirtableRecord<AirtableEventFields>[];
    initialHighlights: AirtableRecord<AirtableHighlightFields>[];
}

export default function DashboardClient({ initialSubmissions, initialEvents, initialHighlights }: Props) {
    const [activeTab, setActiveTab] = useState<"submissions" | "events" | "highlights">("submissions");
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingRecord, setEditingRecord] = useState<DashboardRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const handleEdit = (record: DashboardRecord) => {
        setEditingRecord(record);
        // Pull the image URL from either the Event field ID or the Highlight field ID
        // Determine type by checking for fields unique to events or highlights, or just try access both
        const evt = record as AirtableRecord<AirtableEventFields>;
        const hlt = record as AirtableRecord<AirtableHighlightFields>;

        const imgVal = evt.fldC3VHA5QJfiLh9W || hlt.fld7Bc63XfnJ2rtNV;
        const imgUrl = (imgVal && imgVal.length > 0) ? imgVal[0].url : null;

        setUploadedImageUrl(imgUrl);
        setView("edit");
    };

    const handleCreate = () => {
        setEditingRecord(null);
        setUploadedImageUrl(null);
        setView("create");
    };

    const exportToCSV = () => {
        if (initialSubmissions.length === 0) return;
        const headers = ["ID", "Created At", "Type", "Name", "Email", "Data"];
        const rows = initialSubmissions.map(sub => [
            sub.id,
            sub.created_at,
            sub.type,
            sub.name,
            sub.email,
            JSON.stringify(sub.data).replace(/"/g, '""')
        ]);
        const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `tta_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-[1600px] mx-auto border border-foreground/5 min-h-[80vh] flex flex-col md:flex-row bg-foreground/[0.01]">

                {/* Sidebar */}
                <aside className="w-full md:w-64 border-r border-foreground/5 p-8 flex flex-col gap-12 bg-background">
                    <div className="flex flex-col gap-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6 block">Command Center</span>
                            <nav className="flex flex-col gap-2">
                                <button
                                    onClick={() => { setActiveTab("submissions"); setView("list"); }}
                                    className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-accent text-black' : 'hover:bg-foreground/5 text-foreground/60'}`}
                                >
                                    <Users size={16} /> Submissions
                                </button>
                                <button
                                    onClick={() => { setActiveTab("events"); setView("list"); }}
                                    className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-accent text-black' : 'hover:bg-foreground/5 text-foreground/60'}`}
                                >
                                    <Calendar size={16} /> Manage Events
                                </button>
                                <button
                                    onClick={() => { setActiveTab("highlights"); setView("list"); }}
                                    className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'highlights' ? 'bg-accent text-black' : 'hover:bg-foreground/5 text-foreground/60'}`}
                                >
                                    <Sparkles size={16} /> Live Highlights
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-foreground/5">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 w-full transition-all">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-grow flex flex-col min-w-0">
                    <div className="px-10 py-12 border-b border-foreground/5 bg-background flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">
                                {activeTab === 'submissions' ? 'Archive' : 'Registry'} {'//'} {view}
                            </span>
                            <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground leading-none">
                                {activeTab === 'submissions' && "Submissions"}
                                {activeTab === 'events' && "Events"}
                                {activeTab === 'highlights' && "Highlights"}
                            </h2>
                        </div>

                        <div className="flex gap-4">
                            {activeTab === 'submissions' && (
                                <button onClick={exportToCSV} className="bg-foreground text-background px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-accent hover:text-black transition-all">
                                    <Download size={14} /> Export CSV
                                </button>
                            )}
                            {activeTab !== 'submissions' && view === 'list' && (
                                <button onClick={handleCreate} className="bg-accent text-black px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all">
                                    <PlusCircle size={14} /> Create New
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-10 flex-grow">
                        {message && (
                            <div className={`mb-8 p-4 border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* LIST VIEW: Submissions */}
                        {activeTab === 'submissions' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-foreground/5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 bg-foreground/[0.01]">
                                            <th className="px-10 py-6">Identity</th>
                                            <th className="px-10 py-6">Type</th>
                                            <th className="px-10 py-6">Timestamp</th>
                                            <th className="px-10 py-6">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foreground/5">
                                        {initialSubmissions.map((sub) => (
                                            <tr key={sub.id} className="group hover:bg-foreground/[0.02]">
                                                <td className="px-10 py-8 align-top">
                                                    <span className="text-lg font-black uppercase tracking-tighter block">{sub.name}</span>
                                                    <span className="text-xs opacity-40">{sub.email}</span>
                                                </td>
                                                <td className="px-10 py-8 align-top">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-1 border ${sub.type === 'event' ? 'border-accent text-accent' : 'border-foreground/20 text-foreground/40'}`}>
                                                        {sub.type}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 align-top text-[11px] font-mono opacity-40">{new Date(sub.created_at).toLocaleString()}</td>
                                                <td className="px-10 py-8 align-top">
                                                    <pre className="text-[10px] font-mono whitespace-pre-wrap max-w-sm line-clamp-3">{JSON.stringify(sub.data, null, 2)}</pre>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* LIST VIEW: Events or Highlights */}
                        {(activeTab === 'events' || activeTab === 'highlights') && view === 'list' && (
                            <div className="grid grid-cols-1 gap-4">
                                {(activeTab === 'events' ? initialEvents : initialHighlights).map((item) => {
                                    // Cast for access in map
                                    const evt = item as AirtableRecord<AirtableEventFields>;
                                    const hlt = item as AirtableRecord<AirtableHighlightFields>;
                                    const image = (evt.fldC3VHA5QJfiLh9W && evt.fldC3VHA5QJfiLh9W.length > 0) ? evt.fldC3VHA5QJfiLh9W[0].url :
                                        ((hlt.fld7Bc63XfnJ2rtNV && hlt.fld7Bc63XfnJ2rtNV.length > 0) ? hlt.fld7Bc63XfnJ2rtNV[0].url : null);

                                    const title = activeTab === 'events' ? (evt.fld60g2Jlm4glr70e || "Untitled Event") :
                                        (hlt.fldgZo63Sh0FIouxr ? (hlt.fldgZo63Sh0FIouxr.substring(0, 50) + (hlt.fldgZo63Sh0FIouxr.length > 50 ? '...' : '')) : "Empty Highlight");

                                    const meta = activeTab === 'events'
                                        ? `${evt.fldnqKLlla00mhERq ? new Date(evt.fldnqKLlla00mhERq).toLocaleDateString() : 'Invalid Date'} // ${evt.fldCCH17B42hKfQM9 || 'Undefined'}`
                                        : `Status: ${hlt.fldm41s0glSxCrw4Z ? 'Active' : 'Hidden'}`;

                                    return (
                                        <div key={item.id} className="bg-foreground/[0.02] border border-foreground/5 p-6 flex items-center justify-between group hover:border-accent/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                {image ? (
                                                    <div className="w-16 h-16 bg-foreground/10 overflow-hidden border border-foreground/10">
                                                        <img src={image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                ) : null}
                                                <div>
                                                    <h4 className="text-xl font-black uppercase tracking-tighter underline decoration-accent/20">
                                                        {title}
                                                    </h4>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mt-1">
                                                        {meta}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-3 bg-foreground/5 hover:bg-accent hover:text-black transition-all">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm("Are you sure? This is permanent.")) return;
                                                        setLoading(true);
                                                        const res = activeTab === 'events' ? await deleteAirtableEvent(item.id) : await deleteAirtableHighlight(item.id);
                                                        if (res.success) {
                                                            setMessage({ type: "success", text: "Record obliterated." });
                                                            router.refresh();
                                                        }
                                                        setLoading(false);
                                                    }}
                                                    className="p-3 bg-foreground/5 hover:bg-red-500 hover:text-white transition-all text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* EDIT / CREATE VIEW */}
                        {(view === 'create' || view === 'edit') && (
                            <form
                                action={async (formData) => {
                                    setLoading(true); setMessage(null);
                                    const data = Object.fromEntries(formData);
                                    if (uploadedImageUrl) data.image = uploadedImageUrl;

                                    let res;
                                    if (activeTab === 'events') {
                                        // Need to cast the plain object to EventFormData since we can't type check FormData strictly at runtime easily here
                                        res = view === 'edit'
                                            ? await updateAirtableEvent((editingRecord as AirtableRecord<AirtableEventFields>).id, data as unknown as EventFormData)
                                            : await createAirtableEvent(data as unknown as EventFormData);
                                    } else {
                                        res = view === 'edit'
                                            ? await updateAirtableHighlight((editingRecord as AirtableRecord<AirtableHighlightFields>).id, data as unknown as HighlightFormData)
                                            : await createAirtableHighlight(data as unknown as HighlightFormData);
                                    }

                                    if (res.success) {
                                        setMessage({ type: "success", text: "Intelligence synchronized." });
                                        router.refresh();
                                        setTimeout(() => setView("list"), 1500);
                                    } else {
                                        setMessage({ type: "error", text: `Failure: ${res.error}` });
                                    }
                                    setLoading(false);
                                }}
                                className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12"
                            >
                                <div className="space-y-8">
                                    {activeTab === 'events' ? (
                                        <>
                                            {/* Event Fields */}
                                            {(() => {
                                                const rec = editingRecord as AirtableRecord<AirtableEventFields> | null;
                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Title</label>
                                                            <input name="title" defaultValue={rec?.fld60g2Jlm4glr70e} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Slug</label>
                                                            <input name="slug" defaultValue={rec?.fldfuCZ1yt5Hk0DZp} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Start Date</label>
                                                            <input name="startDate" type="datetime-local" defaultValue={rec?.fldnqKLlla00mhERq?.substring(0, 16)} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Location</label>
                                                            <input name="location" defaultValue={rec?.fldCCH17B42hKfQM9} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <>
                                            {/* Highlight Fields */}
                                            {(() => {
                                                const rec = editingRecord as AirtableRecord<AirtableHighlightFields> | null;
                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-3 col-span-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Intelligence Snippet</label>
                                                            <textarea name="text" defaultValue={rec?.fldgZo63Sh0FIouxr} rows={4} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40 resize-none" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Type</label>
                                                            <select name="type" defaultValue={rec?.fldhj9z8zUncd2WHt} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground appearance-none">
                                                                <option value="news">News</option>
                                                                <option value="speaker">Speaker</option>
                                                                <option value="recap">Recap</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-3 pt-6">
                                                            <input name="isActive" type="checkbox" defaultChecked={rec?.fldm41s0glSxCrw4Z} className="w-5 h-5 bg-foreground/5 border-foreground/10 text-accent" />
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Active/Visible</label>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    <ImageUpload
                                        label="Primary Asset"
                                        currentImage={uploadedImageUrl || undefined} // passed from state or derived
                                        onUploadComplete={(url) => setUploadedImageUrl(url)}
                                    />

                                    {/* Link Field is common-ish but keyed differently? No, kept as separate refs or check types */}
                                    {activeTab === 'events' ? (
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">External Link</label>
                                            <input name="link" defaultValue={(editingRecord as AirtableRecord<AirtableEventFields> | null)?.fld6Azz8y9qUZAXSx} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" placeholder="https://..." />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">External Link</label>
                                            <input name="link" defaultValue={(editingRecord as AirtableRecord<AirtableHighlightFields> | null)?.fldwUq6RZ8GORfYEU} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" placeholder="https://..." />
                                        </div>
                                    )}

                                    {activeTab === 'events' && (
                                        <>
                                            {(() => {
                                                const rec = editingRecord as AirtableRecord<AirtableEventFields> | null;
                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Tags</label>
                                                            <input name="tags" defaultValue={rec?.fld3vQXMLYCgvuiYT?.join(', ')} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none" placeholder="Masterclass, Online" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Short Description</label>
                                                            <textarea name="shortDescription" defaultValue={rec?.fldfWdfSuxHY7iSbA} rows={2} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="Brief summary for cards..." />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Learning Points (Comma Separated)</label>
                                                            <textarea name="learningPoints" defaultValue={rec?.fldLearningPoints} rows={3} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="Strategy 1, Strategy 2..." />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Description</label>
                                                            <textarea name="description" defaultValue={rec?.flddPxpiutxYsuYzL} rows={4} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Speakers (JSON Array)</label>
                                                            <textarea name="speakers" defaultValue={rec?.fld61jNMCFHDGQ2Nq ? (typeof rec.fld61jNMCFHDGQ2Nq === 'string' ? rec.fld61jNMCFHDGQ2Nq : JSON.stringify(rec.fld61jNMCFHDGQ2Nq, null, 2)) : '[{"name": "", "role": "", "avatar": ""}]'} rows={4} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground font-mono text-xs focus:outline-none resize-none" />
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}

                                    <div className="flex gap-4 pt-10">
                                        <button disabled={loading} className="bg-accent text-black font-black uppercase tracking-widest py-6 px-10 flex-grow hover:scale-105 transition-all">
                                            {loading ? "Transmitting..." : (view === 'edit' ? "Synchronize Changes" : "Create Intelligence")}
                                        </button>
                                        <button type="button" onClick={() => setView("list")} className="px-10 border border-foreground/10 font-bold uppercase tracking-widest text-[10px] hover:bg-foreground/5">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
