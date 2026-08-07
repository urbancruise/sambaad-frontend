"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination as PaginationType } from "../types";

interface Props {
    pagination: PaginationType;
    onPageChange: (page: number) => void;
}

export default function EmailPagination({ pagination, onPageChange }: Props) {
    const { page, totalPages, total, limit } = pagination;
    if (total === 0) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>{start}–{end} of {total}</span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-semibold">{page} / {totalPages || 1}</span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}