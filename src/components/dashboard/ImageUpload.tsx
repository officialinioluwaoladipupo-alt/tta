"use client";

import { useState, useRef } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { completeImageUpload, createImageUploadSignature } from "@/lib/cms-actions";
import Image from "next/image";

interface Props {
    onUploadComplete: (url: string, publicId: string) => void;
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
        setFileInfo(null);
        if (!/[.](jpe?g|png|webp)$/i.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Only JPEG, PNG, and WebP images are allowed"); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller"); return; }
        let dimensions: { width: number; height: number };
        const objectUrl = URL.createObjectURL(file);
        try {
            dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                const image = new window.Image();
                image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
                image.onerror = () => reject(new Error("The image file is corrupt or unreadable"));
                image.src = objectUrl;
            });
        } catch {
            setError("This image is corrupt or could not be opened. Try another file.");
            URL.revokeObjectURL(objectUrl);
            return;
        }
        URL.revokeObjectURL(objectUrl);
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
            const signed = await createImageUploadSignature(file.name, entityType);
            if (!signed.success) {
                setError(signed.error);
                return;
            }

            const payload = new FormData();
            payload.append("file", file);
            payload.append("api_key", signed.apiKey);
            payload.append("timestamp", String(signed.timestamp));
            payload.append("folder", signed.folder);
            payload.append("public_id", signed.uploadPublicId);
            payload.append("allowed_formats", signed.allowedFormats);
            payload.append("overwrite", String(signed.overwrite));
            payload.append("signature", signed.signature);
            const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`, {
                method: "POST",
                body: payload,
            });
            if (!response.ok) {
                setError("Cloudinary could not receive this image. Check your Cloudinary settings and try again.");
                return;
            }
            const uploaded = await response.json() as { public_id?: string };
            if (uploaded.public_id !== signed.publicId) {
                setError("Cloudinary returned an unexpected image. Please try again.");
                return;
            }

            const result = await completeImageUpload(signed.publicId, file.name, entityType);
            if (!result.success) {
                setError(result.error);
                return;
            }
            onUploadComplete(result.url, result.publicId);
        } catch (err) {
            console.error(err);
            setError("Upload failed. Check your connection and Cloudinary configuration, then try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-48 w-full max-w-2xl bg-foreground/[0.03] border border-dashed border-foreground/10 flex flex-col items-center justify-center cursor-pointer group hover:border-accent/40 transition-all overflow-hidden"
            >
                {preview ? (
                    <>
                        <Image src={preview} alt="Preview" width={1280} height={720} sizes="(max-width: 768px) 100vw, 50vw" className="h-full w-full object-contain" />
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
                accept="image/jpeg,image/png,image/webp"
            />
            {fileInfo && <p className="text-xs text-foreground/60">{fileInfo.name} · {(fileInfo.size / 1024 / 1024).toFixed(2)} MB · {fileInfo.width}×{fileInfo.height}px</p>}
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
