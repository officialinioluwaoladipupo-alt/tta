"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { FormField } from "@/lib/event-data";
import { saveSubmission } from "@/lib/cms-actions";

interface Props {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    customFields?: FormField[];
}

export default function EventRegistrationForm({ eventId, eventTitle, eventDate, customFields = [] }: Props) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState<Record<string, string>>({
        name: "",
        email: ""
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.name) return;

        setStatus("submitting");

        try {
            // Calculate end date (assume 1 hour duration if not specified)
            const startDate = new Date(eventDate);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            const eventEndDate = endDate.toISOString();

            // Save directly to Neon through the server action.
            await saveSubmission({
                type: "event",
                email: formData.email,
                name: formData.name,
                event_id: eventId,
                data: {
                    ...formData,
                    eventTitle,
                    eventDate,
                    eventEndDate
                }
            });

            setStatus("success");
        } catch (err) {
            console.error("Event registration error:", err);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-accent text-white p-8 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">You&apos;re Registered!</h3>
                <p className="text-white/80 text-sm font-medium mb-6">
                    We&apos;ve sent a calendar invite to <strong>{formData.email}</strong>.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="text-white/60 text-xs uppercase tracking-widest hover:text-white underline decoration-white/30 hover:decoration-white"
                >
                    Register another person
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-foreground/10 p-8 shadow-sm">
            <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                    Free Registration
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-foreground">
                    Secure Your Spot
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {status === "error" && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-fadeIn">
                        Registration failed. Please try again.
                    </div>
                )}

                {/* Standard Fields */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/50">Full Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-foreground/30 font-medium"
                        placeholder="Jane Doe"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/50">Email Address *</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-foreground/30 font-medium"
                        placeholder="jane@example.com"
                    />
                </div>

                {/* Dynamic Fields */}
                {customFields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/50">
                            {field.label} {field.required && "*"}
                        </label>

                        {field.type === "select" ? (
                            <div className="relative">
                                <select
                                    required={field.required}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none font-medium"
                                >
                                    <option value="">Select option</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/50">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                required={field.required}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-foreground/30 font-medium"
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary w-full justify-center mt-2 h-14"
                >
                    {status === "submitting" ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Register Now"
                    )}
                </button>

                <p className="text-[10px] text-foreground/40 text-center uppercase tracking-widest mt-2">
                    Limited spots available
                </p>
            </form>
        </div>
    );
}
