"use client";

import { useState, useRef, DragEvent } from "react";
import { Paperclip, X, Loader2, FileText } from "lucide-react";

export interface PendingAttachment {
    id: string;
    file: File;
    progress: number;
    uploaded: boolean;
    attachmentId?: string;
}

interface Props {
    attachments: PendingAttachment[];
    onFilesAdded: (files: File[]) => void;
    onRemove: (id: string) => void;
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AttachmentDropzone({ attachments, onFilesAdded, onRemove }: Props) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) onFilesAdded(Array.from(e.dataTransfer.files));
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm cursor-pointer transition ${
                    dragging
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                        : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                }`}
            >
                <Paperclip size={15} />
                Drag & drop files here, or click to browse
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
                />
            </div>

            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {attachments.map((a) => (
                        <div
                            key={a.id}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                        >
                            <FileText size={14} className="text-slate-400 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-200">{a.file.name}</p>
                                <p className="text-slate-400">{formatSize(a.file.size)}</p>
                            </div>
                            {!a.uploaded && a.progress < 100 ? (
                                <Loader2 size={13} className="animate-spin text-emerald-500 flex-shrink-0" />
                            ) : (
                                <button onClick={() => onRemove(a.id)} className="text-slate-400 hover:text-rose-500 flex-shrink-0">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}