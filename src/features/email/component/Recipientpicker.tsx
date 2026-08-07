"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { searchRecipients } from "../api/email.service";
import { EmailUser } from "../types";

interface Props {
    label: string;
    selected: EmailUser[];
    onChange: (users: EmailUser[]) => void;
}

export default function RecipientPicker({ label, selected, onChange }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<EmailUser[]>([]);
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        timeoutRef.current = setTimeout(async () => {
            const data = await searchRecipients(query);
            setResults(data.filter((u: EmailUser) => !selected.some((s) => s.id === u.id)));
            setOpen(true);
        }, 250);
    }, [query, selected]);

    const addUser = (user: EmailUser) => {
        onChange([...selected, user]);
        setQuery("");
        setResults([]);
        setOpen(false);
    };

    const removeUser = (id: number) => {
        onChange(selected.filter((u) => u.id !== id));
    };

    return (
        <div className="relative flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 px-4 py-2">
            <span className="text-sm text-slate-400 pt-1.5 w-8 flex-shrink-0">{label}</span>
            <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                {selected.map((u) => (
                    <span
                        key={u.id}
                        className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                        {u.fullName}
                        <button onClick={() => removeUser(u.id)}>
                            <X size={11} />
                        </button>
                    </span>
                ))}
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    placeholder={selected.length === 0 ? "Type a name or email..." : ""}
                    className="flex-1 min-w-[120px] bg-transparent text-sm py-1 focus:outline-none dark:text-white"
                />
            </div>

            {open && results.length > 0 && (
                <div className="absolute left-12 top-full mt-1 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20 max-h-56 overflow-y-auto">
                    {results.map((u) => (
                        <button
                            key={u.id}
                            onMouseDown={() => addUser(u)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{u.fullName}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}