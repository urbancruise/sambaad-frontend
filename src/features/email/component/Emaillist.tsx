"use client";

import { useState } from "react";

import { EmailQueryFolder, FOLDER_LABELS, BulkAction } from "../types";
import { useFolderEmails } from "../hooks/useFolderEmails";
import { setFlags, bulkAction as bulkActionApi } from "../api/email.service";

import EmailSearchBar from "./EmailSearchBar";
import BulkActionToolbar from "./BulkActionToolbar";
import EmailListItemRow from "./EmailListItemRow";
import EmailPagination from "./EmailPagination";
import { EmailListLoading, EmailListEmpty, EmailListError } from "./EmailListStates";

interface Props {
    folder: EmailQueryFolder;
}

export default function EmailList({ folder }: Props) {
    const {
        emails, pagination, loading, error,
        search, setSearch, order, setOrder,
        setPage, refresh, setEmails,
    } = useFolderEmails(folder);

    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleStar = async (emailId: string, current: boolean) => {
        setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, isStarred: !current } : e)));
        try {
            await setFlags(emailId, { isStarred: !current });
        } catch {
            refresh();
        }
    };

    const handleBulk = async (action: BulkAction) => {
        const ids = [...selected];
        setSelected(new Set());
        try {
            await bulkActionApi(ids, action);
        } finally {
            refresh();
        }
    };

    const folderLabel =
        folder === "STARRED" ? "Starred" : folder === "IMPORTANT" ? "Important" : FOLDER_LABELS[folder];

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">{folderLabel}</h1>
            </div>

            <EmailSearchBar search={search} onSearchChange={setSearch} order={order} onOrderChange={setOrder} />

            <BulkActionToolbar count={selected.size} onAction={handleBulk} onClear={() => setSelected(new Set())} />

            <div className="flex-1 overflow-y-auto">
                {loading && <EmailListLoading />}
                {!loading && error && <EmailListError message={error} onRetry={refresh} />}
                {!loading && !error && emails.length === 0 && <EmailListEmpty folderLabel={folderLabel} />}
                {!loading && !error && emails.map((email) => (
                    <EmailListItemRow
                        key={email.id}
                        email={email}
                        selected={selected.has(email.id)}
                        onToggleSelect={() => toggleSelect(email.id)}
                        onToggleStar={() => toggleStar(email.id, email.isStarred)}
                    />
                ))}
            </div>

            {pagination && !loading && !error && (
                <EmailPagination pagination={pagination} onPageChange={setPage} />
            )}
        </div>
    );
}
