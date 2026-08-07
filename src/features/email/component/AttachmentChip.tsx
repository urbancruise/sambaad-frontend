"use client";

import { FileText, Image as ImageIcon, Download, Eye } from "lucide-react";
import { useState } from "react";
import { Attachment } from "../types";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AttachmentChip({ attachment }: { attachment: Attachment }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const isImage = attachment.mimeType.startsWith("image/");
    const url = `${API_ORIGIN}${attachment.fileUrl}`;

    return (
        <>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs">
                {isImage ? <ImageIcon size={16} className="text-slate-400" /> : <FileText size={16} className="text-slate-400" />}
                <div className="min-w-0">
                    <p className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-200">{attachment.fileName}</p>
                    <p className="text-slate-400">{formatSize(attachment.fileSize)}</p>
                </div>
                <div className="flex items-center gap-1 ml-1">
                    {isImage && (
                        <button onClick={() => setPreviewOpen(true)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                            <Eye size={13} />
                        </button>
                    )}
                    <a href={url} download={attachment.fileName} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <Download size={13} />
                    </a>
                </div>
            </div>

            {previewOpen && isImage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" onClick={() => setPreviewOpen(false)}>
                    <div className="absolute inset-0 bg-black/70" />
                    <img src={url} alt={attachment.fileName} className="relative max-h-[85vh] max-w-full rounded-xl shadow-2xl" />
                </div>
            )}
        </>
    );
}