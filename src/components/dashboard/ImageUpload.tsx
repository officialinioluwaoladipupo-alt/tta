"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/cms-actions";

interface Props {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    label: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, label }: Props) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
            const base64 = await toBase64(file);
            const res = await uploadImage(base64 as string, file.name);

            if (res.success && res.url) {
                onUploadComplete(res.url);
            } else {
                alert("Upload failed: " + res.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
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
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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
        </div>
    );
}
