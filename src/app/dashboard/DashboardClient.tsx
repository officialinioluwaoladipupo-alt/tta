"use client";

import { useState } from "react";
import { Users, PlusCircle, Sparkles, Download, Calendar, LogOut, Trash2, Edit3, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    createEvent,
    updateEvent,
    deleteEvent,
    createHighlight,
    updateHighlight,
    deleteHighlight
    , updateSettings, exportSubmissionsCsv, deleteSubmission
} from "@/lib/cms-actions";
import ImageUpload from "@/components/dashboard/ImageUpload";
import SpeakerEditor from "@/components/dashboard/SpeakerEditor";
import {
    ContentRecord,
    EventFields,
    HighlightFields,
    EventFormData,
    HighlightFormData
} from "@/lib/cms-types";
import type { Permission } from "@/lib/authorization";
import type { SubmissionFilters } from "@/lib/submission-data";
import type { Speaker } from "@/lib/event-data";

// Helper type for union of record types
type DashboardRecord = ContentRecord<EventFields> | ContentRecord<HighlightFields>;

function eventField(record: ContentRecord<EventFields> | null, key: string, legacyKey?: string) {
    const value = record?.[key] ?? (legacyKey ? record?.[legacyKey] : undefined);
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string").join(", ");
    return "";
}

function eventSpeakers(record: ContentRecord<EventFields> | null) {
    const value = record?.speakers ?? record?.fld61jNMCFHDGQ2Nq;
    if (typeof value === "string") return value;
    return Array.isArray(value) ? value as Speaker[] : undefined;
}

interface Props {
    initialSubmissions: Submission[]; // Submissions are stored in Neon
    initialEvents: ContentRecord<EventFields>[];
    initialHighlights: ContentRecord<HighlightFields>[];
    initialSettings?: Record<string, unknown>;
    permissions: string[];
    submissionFilters: SubmissionFilters;
    submissionPage: number;
    submissionTotal: number;
    submissionError?: string;
}

interface Submission {
    id: string;
    created_at: string;
    type: string;
    name: string;
    email: string;
    data: unknown;
}

export default function DashboardClient({ initialSubmissions, initialEvents, initialHighlights, initialSettings, permissions, submissionFilters, submissionPage, submissionTotal, submissionError }: Props) {
    const can = (permission: Permission) => permissions.includes(permission);
    const [activeTab, setActiveTab] = useState<"submissions" | "events" | "highlights" | "settings">("submissions");
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingRecord, setEditingRecord] = useState<DashboardRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(submissionError ? "We couldn't load submissions. Try again." : null);

    const router = useRouter();

    const handleLogout = async () => {
        window.location.href = "/auth/logout";
    };

    const handleEdit = (record: DashboardRecord) => {
        setEditingRecord(record);
        // Pull the image URL from either the Event field ID or the Highlight field ID
        // Determine type by checking for fields unique to events or highlights, or just try access both
        const evt = record as ContentRecord<EventFields>;
        const hlt = record as ContentRecord<HighlightFields>;

        const imgVal = evt.fldC3VHA5QJfiLh9W || hlt.fld7Bc63XfnJ2rtNV;
        const imgUrl = typeof evt.image === "string" ? evt.image : (imgVal && imgVal.length > 0) ? imgVal[0].url : null;

        setUploadedImageUrl(imgUrl);
        setUploadedImagePublicId(typeof evt.imagePublicId === "string" ? evt.imagePublicId : null);
        setView("edit");
    };

    const handleCreate = () => {
        setEditingRecord(null);
        setUploadedImageUrl(null);
        setUploadedImagePublicId(null);
        setView("create");
    };

    const filtersQuery = (page: number) => {
        const params = new URLSearchParams();
        if (submissionFilters.search) params.set("search", submissionFilters.search);
        if (submissionFilters.type) params.set("type", submissionFilters.type);
        if (submissionFilters.from) params.set("from", submissionFilters.from);
        if (submissionFilters.to) params.set("to", submissionFilters.to);
        params.set("page", String(page));
        return `?${params.toString()}`;
    };

    const exportToCSV = async () => {
        if (!window.confirm("This file contains personal data. Continue with the export?")) return;
        setPendingAction("export"); setSubmissionMessage(null);
        try {
            const result = await exportSubmissionsCsv(submissionFilters);
            if (!result.success || !result.csv) setSubmissionMessage("We couldn't export these submissions. Please try again.");
            else {
                const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `tta_submissions_${new Date().toISOString().split("T")[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
            }
        } catch { setSubmissionMessage("We couldn't export these submissions. Please try again."); }
        setPendingAction(null);
    };

    const removeSubmission = async (submission: Submission) => {
        if (!window.confirm(`Delete the submission from ${submission.name || submission.email}?`)) return;
        setPendingAction(`delete-${submission.id}`); setSubmissionMessage(null);
        try {
            const result = await deleteSubmission(submission.id, submission.name || submission.email);
            if (result.success) router.refresh();
            else setSubmissionMessage("We couldn't delete that submission. Please try again.");
        } catch { setSubmissionMessage("We couldn't delete that submission. Please try again."); }
        setPendingAction(null);
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
                                {can("manage:settings") && <button
                                    onClick={() => { setActiveTab("settings"); setView("edit"); }}
                                    className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-accent text-black' : 'hover:bg-foreground/5 text-foreground/60'}`}
                                >
                                    <Settings size={16} /> Global Settings
                                </button>}
                                {can("manage:team") && <Link href="/dashboard/team" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground/5 text-foreground/60">
                                    <Users size={16} /> Manage Team
                                </Link>}
                                {can("manage:settings") && <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground/5 text-foreground/60">
                                    <Settings size={16} /> Audit Log
                                </Link>}
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
                                {activeTab === 'settings' && "Global Settings"}
                            </h2>
                        </div>

                        <div className="flex gap-4">
                            {activeTab === 'submissions' && can("export:data") && (
                                <button disabled={pendingAction === "export"} onClick={exportToCSV} className="bg-foreground text-background px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-accent hover:text-black transition-all disabled:opacity-50">
                                    <Download size={14} /> {pendingAction === "export" ? "Preparing..." : "Export CSV"}
                                </button>
                            )}
                            {activeTab !== 'submissions' && activeTab !== 'settings' && view === 'list' && can(activeTab === "events" ? "edit:events" : "edit:highlights") && (
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
                            <div className="space-y-8">
                                <form method="get" className="grid grid-cols-1 md:grid-cols-5 gap-3 border border-foreground/10 p-4">
                                    <input name="search" defaultValue={submissionFilters.search || ""} placeholder="Search name or email" className="bg-foreground/[0.03] border border-foreground/10 p-3 text-sm md:col-span-2" />
                                    <select name="type" defaultValue={submissionFilters.type || ""} className="bg-foreground/[0.03] border border-foreground/10 p-3 text-sm">
                                        <option value="">All types</option><option value="newsletter">Newsletter</option><option value="join">Community join</option><option value="event">Event registration</option>
                                    </select>
                                    <input name="from" type="date" defaultValue={submissionFilters.from || ""} className="bg-foreground/[0.03] border border-foreground/10 p-3 text-sm" />
                                    <input name="to" type="date" defaultValue={submissionFilters.to || ""} className="bg-foreground/[0.03] border border-foreground/10 p-3 text-sm" />
                                    <input type="hidden" name="page" value="1" />
                                    <div className="md:col-span-5 flex flex-wrap gap-2 items-center">
                                        <button className="btn-primary px-5 py-3 text-xs">Apply filters</button>
                                        <Link href="/dashboard" className="btn-outline px-5 py-3 text-xs">Clear filters</Link>
                                        <span className="text-xs opacity-50 ml-auto">Quick range:</span>
                                        {[{ label: "Today", days: 0 }, { label: "7 days", days: 7 }, { label: "30 days", days: 30 }].map((preset) => {
                                            const date = new Date(); date.setDate(date.getDate() - preset.days);
                                            const from = date.toISOString().slice(0, 10);
                                            return <Link key={preset.label} href={`/dashboard?from=${from}&page=1`} className="btn-outline px-3 py-2 text-xs">{preset.label}</Link>;
                                        })}
                                    </div>
                                </form>
                                {submissionMessage && <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex justify-between gap-4"><span>{submissionMessage}</span><button onClick={() => router.refresh()} className="underline">Retry</button></div>}
                                {initialSubmissions.length === 0 && !submissionMessage ? <div className="border border-foreground/10 p-10 text-center"><p className="font-bold">No submissions match these filters.</p><Link href="/dashboard" className="text-accent underline mt-2 inline-block">Clear filters</Link></div> : <div className="overflow-x-auto">
                                <table className="dashboard-submissions-table w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-foreground/5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 bg-foreground/[0.01]">
                                            <th className="px-10 py-6">Identity</th>
                                            <th className="px-10 py-6">Type</th>
                                            <th className="px-10 py-6">Timestamp</th>
                                            <th className="px-10 py-6">Data</th>
                                            <th className="px-10 py-6">Actions</th>
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
                                                <td className="px-10 py-8 align-top"><button disabled={!can("delete:content") || pendingAction === `delete-${sub.id}`} onClick={() => removeSubmission(sub)} className="text-red-500 text-xs font-bold uppercase disabled:opacity-40">{pendingAction === `delete-${sub.id}` ? "Deleting..." : "Delete"}</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>}
                                {submissionTotal > 0 && <div className="flex items-center justify-between text-sm"><span>{submissionTotal} total · page {submissionPage} of {Math.ceil(submissionTotal / 50)}</span><div className="flex gap-2">{submissionPage > 1 && <Link href={`/dashboard${filtersQuery(submissionPage - 1)}`} className="btn-outline px-4 py-2">Previous</Link>}{submissionPage < Math.ceil(submissionTotal / 50) && <Link href={`/dashboard${filtersQuery(submissionPage + 1)}`} className="btn-outline px-4 py-2">Next</Link>}</div></div>}
                            </div>
                        )}

                        {/* LIST VIEW: Events or Highlights */}
                        {(activeTab === 'events' || activeTab === 'highlights') && view === 'list' && (
                            <div className="grid grid-cols-1 gap-4">
                                {(activeTab === 'events' ? initialEvents : initialHighlights).map((item) => {
                                    // Cast for access in map
                                    const evt = item as ContentRecord<EventFields>;
                                    const hlt = item as ContentRecord<HighlightFields>;
                                    const image = (typeof evt.image === "string" ? evt.image : undefined) || ((evt.fldC3VHA5QJfiLh9W && evt.fldC3VHA5QJfiLh9W.length > 0) ? evt.fldC3VHA5QJfiLh9W[0].url :
                                        ((hlt.fld7Bc63XfnJ2rtNV && hlt.fld7Bc63XfnJ2rtNV.length > 0) ? hlt.fld7Bc63XfnJ2rtNV[0].url : null));

                                    const title = activeTab === 'events' ? (eventField(evt, "title", "fld60g2Jlm4glr70e") || "Untitled Event") :
                                        (hlt.fldgZo63Sh0FIouxr ? (hlt.fldgZo63Sh0FIouxr.substring(0, 50) + (hlt.fldgZo63Sh0FIouxr.length > 50 ? '...' : '')) : "Empty Highlight");

                                    const meta = activeTab === 'events'
                                        ? `${eventField(evt, "startDate", "fldnqKLlla00mhERq") ? new Date(eventField(evt, "startDate", "fldnqKLlla00mhERq")).toLocaleDateString() : 'Date not set'} // ${eventField(evt, "format") || eventField(evt, "location", "fldCCH17B42hKfQM9") || 'Online'}`
                                        : `Status: ${hlt.fldm41s0glSxCrw4Z ? 'Active' : 'Hidden'}`;

                                    return (
                                        <div key={item.id} className="bg-foreground/[0.02] border border-foreground/5 p-6 flex items-center justify-between group hover:border-accent/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                {image ? (
                                                    <div className="w-16 h-16 bg-foreground/10 overflow-hidden border border-foreground/10">
                                                <Image src={image} fill sizes="120px" className="object-contain" alt="" />
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
                                                {can(activeTab === "events" ? "edit:events" : "edit:highlights") && <button onClick={() => handleEdit(item)} className="p-3 bg-foreground/5 hover:bg-accent hover:text-black transition-all">
                                                    <Edit3 size={16} />
                                                </button>}
                                                {can("delete:content") && <button
                                                    onClick={async () => {
                                                        if (!confirm("Are you sure? This is permanent.")) return;
                                                        setLoading(true);
                                                        const res = activeTab === 'events' ? await deleteEvent(item.id) : await deleteHighlight(item.id);
                                                        if (res.success) {
                                                            setMessage({ type: "success", text: "Record obliterated." });
                                                            router.refresh();
                                                        }
                                                        setLoading(false);
                                                    }}
                                                    className="p-3 bg-foreground/5 hover:bg-red-500 hover:text-white transition-all text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'settings' && can("manage:settings") && (
                            <form action={async (formData) => {
                                setLoading(true); setMessage(null);
                                const result = await updateSettings(Object.fromEntries(formData));
                                setMessage(result.success ? { type: "success", text: "Global settings synchronized." } : { type: "error", text: result.error || "Settings update failed." });
                                setLoading(false);
                            }} className="max-w-3xl grid gap-8">
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">Site Name<input name="siteName" defaultValue={String(initialSettings?.siteName || "The Thinking Architect")} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5" required /></label>
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">Site Description<textarea name="siteDescription" defaultValue={String(initialSettings?.siteDescription || "")} rows={3} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5" /></label>
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">Homepage Marquee<textarea name="marqueeText" defaultValue={String(initialSettings?.marqueeText || "THE THINKING ARCHITECT // JOIN THE COMMUNITY")} rows={4} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5" required /></label>
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">Footer Marquee<input name="footerMarqueeText" defaultValue={String(initialSettings?.footerMarqueeText || "TTA")} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5" required /></label>
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">SEO Image URL<input name="defaultSeoImage" type="url" defaultValue={String(initialSettings?.defaultSeoImage || "")} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5" /></label>
                                <label className="grid gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">Team Members (JSON)<textarea name="teamMembers" defaultValue={String(initialSettings?.teamMembers || '[{"name":"","role":"","bio":"","photo":""}]')} rows={8} className="text-base normal-case tracking-normal opacity-100 bg-foreground/[0.03] border border-foreground/10 p-5 font-mono" /><span className="text-[10px] normal-case tracking-normal opacity-50">Upload each photo to Cloudinary, then use its secure URL in the photo field.</span></label>
                                <button disabled={loading} className="bg-accent text-black font-black uppercase tracking-widest py-6 px-10">{loading ? "Saving..." : "Save Global Settings"}</button>
                            </form>
                        )}

                        {/* EDIT / CREATE VIEW */}
                        {activeTab !== 'settings' && (view === 'create' || view === 'edit') && (
                            <form
                                action={async (formData) => {
                                    setLoading(true); setMessage(null);
                                    const data = Object.fromEntries(formData);
                                    if (uploadedImageUrl) data.image = uploadedImageUrl;
                                    if (uploadedImagePublicId) data.imagePublicId = uploadedImagePublicId;

                                    let res;
                                    if (activeTab === 'events') {
                                        // Need to cast the plain object to EventFormData since we can't type check FormData strictly at runtime easily here
                                        res = view === 'edit'
                                            ? await updateEvent((editingRecord as ContentRecord<EventFields>).id, data as unknown as EventFormData)
                                            : await createEvent(data as unknown as EventFormData);
                                    } else {
                                        res = view === 'edit'
                                            ? await updateHighlight((editingRecord as ContentRecord<HighlightFields>).id, data as unknown as HighlightFormData)
                                            : await createHighlight(data as unknown as HighlightFormData);
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
                                                const rec = editingRecord as ContentRecord<EventFields> | null;
                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Title</label>
                                                            <input name="title" defaultValue={eventField(rec, "title", "fld60g2Jlm4glr70e")} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Slug</label>
                                                            <input name="slug" defaultValue={eventField(rec, "slug", "fldfuCZ1yt5Hk0DZp")} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Start Date</label>
                                                            <input name="startDate" type="datetime-local" defaultValue={eventField(rec, "startDate", "fldnqKLlla00mhERq").substring(0, 16)} required className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Location</label>
                                                            <input name="location" defaultValue={eventField(rec, "location", "fldCCH17B42hKfQM9")} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Session Number</label>
                                                            <input name="sessionNumber" defaultValue={eventField(rec, "sessionNumber")} placeholder="01" className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Format</label>
                                                            <input name="format" defaultValue={eventField(rec, "format") || "Online"} placeholder="Online" className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" />
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <>
                                            {/* Highlight Fields */}
                                            {(() => {
                                                const rec = editingRecord as ContentRecord<HighlightFields> | null;
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
                                    {can("edit:media") && <ImageUpload
                                        label="Primary Asset"
                                        entityType={activeTab === "events" ? "event" : "highlight"}
                                        currentImage={uploadedImageUrl || undefined} // passed from state or derived
                                        onUploadComplete={(url, publicId) => { setUploadedImageUrl(url); setUploadedImagePublicId(publicId); }}
                                    />}

                                    {/* Link Field is common-ish but keyed differently? No, kept as separate refs or check types */}
                                    {activeTab === 'events' ? (
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">External Link</label>
                                                            <input name="link" type="url" defaultValue={eventField(editingRecord as ContentRecord<EventFields> | null, "link", "fld6Azz8y9qUZAXSx")} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" placeholder="https://lu.ma/... (optional)" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">External Link</label>
                                            <input name="link" type="url" defaultValue={(editingRecord as ContentRecord<HighlightFields> | null)?.fldwUq6RZ8GORfYEU} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none focus:border-accent/40" placeholder="https://... (optional)" />
                                        </div>
                                    )}

                                    {activeTab === 'events' && (
                                        <>
                                            {(() => {
                                                const rec = editingRecord as ContentRecord<EventFields> | null;
                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Tags</label>
                                                            <input name="tags" defaultValue={eventField(rec, "tags", "fld3vQXMLYCgvuiYT")} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none" placeholder="Masterclass, Online" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Short Description</label>
                                                            <textarea name="shortDescription" defaultValue={eventField(rec, "shortDescription", "fldfWdfSuxHY7iSbA")} rows={2} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="Brief summary for cards..." />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Learning Points (Comma Separated)</label>
                                                            <textarea name="learningPoints" defaultValue={eventField(rec, "learningPoints", "fldLearningPoints")} rows={3} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="Strategy 1, Strategy 2..." />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Description</label>
                                                            <textarea name="description" defaultValue={eventField(rec, "description", "flddPxpiutxYsuYzL")} rows={4} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Recording URL</label>
                                                            <input name="recordingUrl" type="url" defaultValue={eventField(rec, "recordingUrl")} placeholder="https://youtube.com/watch?v=..." className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">After-session notes</label>
                                                            <textarea name="sessionNotes" defaultValue={eventField(rec, "sessionNotes")} rows={4} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="Notes and key takeaways, if available" />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Resources (one URL or note per line)</label>
                                                            <textarea name="resources" defaultValue={eventField(rec, "resources")} rows={4} className="bg-foreground/[0.03] border border-foreground/10 p-5 text-foreground focus:outline-none resize-none" placeholder="https://..." />
                                                        </div>
                                                        <SpeakerEditor initialValue={eventSpeakers(rec)} />
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}

                                    <div className="flex gap-4 pt-10">
                                        {activeTab === "events" && <button type="button" onClick={(event) => { const form = event.currentTarget.form; if (form) { const data = Object.fromEntries(new FormData(form)); window.open(`/events/preview?data=${encodeURIComponent(JSON.stringify(data))}`, "_blank", "noopener,noreferrer"); } }} className="btn-outline py-6 px-6">Preview</button>}
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
