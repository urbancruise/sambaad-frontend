"use client";

import { useCallback, useEffect, useState } from "react";
import { EmailQueryFolder, EmailListItem, Pagination } from "../types";
import { getFolder } from "../api/email.service";

export const useFolderEmails = (folder: EmailQueryFolder) => {
    const [emails, setEmails] = useState<EmailListItem[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [label, setLabel] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFolder(folder, { search, label, sortBy, order, page, limit: 25 });
            setEmails(data.emails);
            setPagination(data.pagination);
        } catch {
            setError("Unable to load this folder.");
        } finally {
            setLoading(false);
        }
    }, [folder, search, label, sortBy, order, page]);

    useEffect(() => {
        setPage(1);
    }, [folder, search, label, sortBy, order]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        emails,
        pagination,
        loading,
        error,
        search,
        setSearch,
        label,
        setLabel,
        sortBy,
        setSortBy,
        order,
        setOrder,
        page,
        setPage,
        refresh: load,
        setEmails,
    };
};