"use client";

import { useState, useRef } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/cms-actions";
import Image from "next/image";

interface Props {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    label: string;
    entityType?: "event" | "team" | "speaker" | "highlight" | "content";
}

export default function ImageUpload({ onUploadComplete, currentImage, label, entityType = "content" }: Props) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: number; width: number; height: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        if (!/[.](jpe?g|png|webp)$/i.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Only JPEG, PNG, and WebP images are allowed"); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller"); return; }
        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => { const image = new window.Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => reject(new Error("The image file is corrupt or unreadable")); image.src = URL.createObjectURL(file); });
        setFileInfo({ name: file.name, size: file.size, ...dimensions });

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            // Convert to base64 for server action
            const dataUrl = await toBase64(file);
            const res = await uploadImage(dataUrl, file.name, entityType);

            if (res.success && res.url) {
                onUploadComplete(res.url);
            } else {
            setError(res.error || "Upload failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-video w-full bg-foreground/[0.03] border border-dashed border-foreground/10 flex flex-col items-center justify-center cursor-pointer group hover:border-accent/40 transition-all overflow-hidden"
            >
                {preview ? (
                    <>
                        <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload className="text-white" size={24} />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground/20 group-hover:text-accent/40 transition-colors">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Select Asset</span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 className="animate-spin text-accent" size={24} />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {fileInfo && <p className="text-xs text-foreground/60">{fileInfo.name} · {(fileInfo.size / 1024 / 1024).toFixed(2)} MB · {fileInfo.width}×{fileInfo.height}px</p>}
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
