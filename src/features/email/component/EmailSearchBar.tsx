"use client";

import { Search, ArrowUpDown } from "lucide-react";

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    order: "asc" | "desc";
    onOrderChange: (v: "asc" | "desc") => void;
}

export default function EmailSearchBar({ search, onSearchChange, order, onOrderChange }: Props) {
    return (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search mail..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                />
            </div>
            <button
                onClick={() => onOrderChange(order === "desc" ? "asc" : "desc")}
                title="Toggle sort order"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <ArrowUpDown size={16} />
            </button>
        </div>
    );
}