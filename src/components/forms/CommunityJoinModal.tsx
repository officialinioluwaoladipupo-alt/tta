"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CommunityJoinForm from "./CommunityJoinForm";

interface CommunityJoinModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommunityJoinModal({ isOpen, onClose }: CommunityJoinModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        } else {
            // Re-enable body scroll
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating && isOpen ? "opacity-100" : "opacity-0"
                }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className={`relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isAnimating && isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    }`}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Wave emoji header */}
                <div className="relative px-6 pt-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl animate-wave">👋</span>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                                Join The Community
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Become part of The Thinking Architect
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form content */}
                <div className="relative px-6 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <CommunityJoinForm onClose={handleClose} />
                </div>
            </div>
        </div>
    );
}
