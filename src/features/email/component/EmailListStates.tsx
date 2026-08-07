"use client";

import { Inbox, AlertTriangle, Loader2 } from "lucide-react";

export function EmailListLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 size={28} className="animate-spin mb-3" />
            <p className="text-sm font-medium">Loading your mail...</p>
        </div>
    );
}

export function EmailListEmpty({ folderLabel }: { folderLabel: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                <Inbox size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{folderLabel} is empty</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                Nothing here right now — new mail will show up as soon as it arrives.
            </p>
        </div>
    );
}

export function EmailListError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Something went wrong</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">{message}</p>
            <button
                onClick={onRetry}
                className="mt-4 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
                Try again
            </button>
        </div>
    );
}