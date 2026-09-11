"use client";

import { useState } from "react";
import { COUNTRIES, JOURNEY_STAGES, REFERRAL_SOURCES } from "@/lib/form-constants";
import { Check, MessageCircle, Gamepad2, ArrowRight } from "lucide-react";
import { saveSubmission } from "@/lib/cms-actions";

type SuccessType = "WHATSAPP" | "DISCORD" | null;

interface CommunityJoinFormProps {
    onClose?: () => void;
}

export default function CommunityJoinForm({ onClose }: CommunityJoinFormProps = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successType, setSuccessType] = useState<SuccessType>(null);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        country: "",
        stage: "",
        whyJoin: "",
        howFound: "",
        otherFound: "",
        consent: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.country) newErrors.country = "Please select your country";
        if (!formData.stage) newErrors.stage = "Please select your journey stage";

        if (!formData.whyJoin.trim()) {
            newErrors.whyJoin = "This field is required";
        } else if (formData.whyJoin.length > 150) {
            newErrors.whyJoin = "Please keep it under 150 characters";
        }

        if (!formData.howFound) newErrors.howFound = "Please select an option";
        if (formData.howFound === "Other" && !formData.otherFound.trim()) {
            newErrors.otherFound = "Please specify";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrorStatus(null);

        try {
            // Save directly to Neon through the server action.
            await saveSubmission({
                type: "join",
                email: formData.email,
                name: formData.fullName,
                data: {
                    ...formData,
                    routing: "WHATSAPP",
                }
            });

            setSuccessType("WHATSAPP");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Submission error:", err);
            setErrorStatus("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Success State
    if (successType) {
        const isDiscord = false;

        return (
            <div className="w-full flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn bg-white border border-foreground/10 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-8 animate-bounce">
                    <Check className="w-12 h-12 text-accent" strokeWidth={3} />
                </div>

                <h3 className="text-4xl font-heading font-black uppercase tracking-tighter mb-4">You&apos;re In.</h3>
                <p className="text-foreground/70 mb-10 text-lg">Welcome to The Thinking Architect.</p>

                <div className="w-full max-w-md border-t border-b border-foreground/10 py-10 mb-10">
                    <p className="text-sm uppercase tracking-widest text-foreground/50 font-bold mb-8">One last step — join the community:</p>

                    <a
                        href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full btn-primary py-6 text-xl justify-center gap-4 ${isDiscord ? 'bg-[#5865F2] hover:bg-[#4752C4] text-white' : 'bg-[#25D366] hover:bg-[#128C7E] text-white'}`}
                    >
                        {isDiscord ? <Gamepad2 className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
                        Join {isDiscord ? "Discord" : "WhatsApp"} Community
                    </a>
                </div>

                <p className="text-sm text-foreground/50 font-mono">
                    This is where the real conversations happen.<br />
                    See you inside. — TTA
                </p>
            </div>
        );
    }

    // Form State
    return (
        <div className="bg-white p-6 md:p-10 border border-foreground/10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errorStatus && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold animate-fadeIn">
                        {errorStatus}
                    </div>
                )}

                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        Name <span className="text-accent">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-foreground/5 border ${errors.fullName ? "border-red-500" : "border-foreground/10"
                            } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none placeholder:text-foreground/30`}
                        placeholder="Your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        Email <span className="text-accent">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-foreground/5 border ${errors.email ? "border-red-500" : "border-foreground/10"
                            } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none placeholder:text-foreground/30`}
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                </div>

                {/* Country */}
                <div>
                    <label htmlFor="country" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        Where are you based? <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-foreground/5 border ${errors.country ? "border-red-500" : "border-foreground/10"
                                } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none appearance-none`}
                        >
                            <option value="" className="text-foreground/50">Select a country</option>
                            {COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/50">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                    {errors.country && <p className="text-red-500 text-xs mt-1 font-bold">{errors.country}</p>}
                </div>

                {/* Stage */}
                <div>
                    <label htmlFor="stage" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        Where are you in your journey? <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="stage"
                            name="stage"
                            value={formData.stage}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-foreground/5 border ${errors.stage ? "border-red-500" : "border-foreground/10"
                                } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none appearance-none`}
                        >
                            <option value="" className="text-foreground/50">Select stage</option>
                            {JOURNEY_STAGES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/50">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                    {errors.stage && <p className="text-red-500 text-xs mt-1 font-bold">{errors.stage}</p>}
                </div>

                {/* Why Join */}
                <div>
                    <label htmlFor="whyJoin" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        Why do you want to join? <span className="text-accent">*</span>
                    </label>
                    <textarea
                        id="whyJoin"
                        name="whyJoin"
                        value={formData.whyJoin}
                        onChange={handleInputChange}
                        maxLength={150}
                        rows={2}
                        className={`w-full px-4 py-3 bg-foreground/5 border ${errors.whyJoin ? "border-red-500" : "border-foreground/10"
                            } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none resize-none placeholder:text-foreground/30`}
                        placeholder="One sentence. Be honest."
                    />
                    <div className="flex justify-between mt-1">
                        {errors.whyJoin ? (
                            <p className="text-red-500 text-xs font-bold">{errors.whyJoin}</p>
                        ) : <span></span>}
                        <p className="text-foreground/30 text-xs text-right font-mono">{formData.whyJoin.length}/150</p>
                    </div>
                </div>

                {/* How Found */}
                <div>
                    <label htmlFor="howFound" className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/70">
                        How did you find us? <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="howFound"
                            name="howFound"
                            value={formData.howFound}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-foreground/5 border ${errors.howFound ? "border-red-500" : "border-foreground/10"
                                } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none appearance-none`}
                        >
                            <option value="" className="text-foreground/50">Select option</option>
                            {REFERRAL_SOURCES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/50">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                    {errors.howFound && <p className="text-red-500 text-xs mt-1 font-bold">{errors.howFound}</p>}
                </div>

                {/* Conditional Other */}
                {formData.howFound === "Other" && (
                    <div className="animate-fadeIn">
                        <input
                            type="text"
                            id="otherFound"
                            name="otherFound"
                            value={formData.otherFound}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-foreground/5 border ${errors.otherFound ? "border-red-500" : "border-foreground/10"
                                } focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none placeholder:text-foreground/30`}
                            placeholder="Please specify"
                        />
                        {errors.otherFound && <p className="text-red-500 text-xs mt-1 font-bold">{errors.otherFound}</p>}
                    </div>
                )}

                {/* Consent */}
                <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleInputChange}
                                className="peer h-5 w-5 cursor-pointer appearance-none bg-foreground/5 border border-foreground/20 checked:bg-accent checked:border-accent transition-all"
                            />
                            <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <span className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors select-none leading-relaxed">
                            Send me TTA updates, event invites, and resources.
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-5 text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Join the community <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                    <p className="text-center text-xs text-foreground/40 mt-6 font-mono">
                        WE RESPECT YOUR PRIVACY. NO SPAM.
                    </p>
                </div>
            </form>
        </div>
    );
}
