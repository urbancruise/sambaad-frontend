"use client";

import { useEffect, useState } from "react";

interface Props {
    value: number | null;
    editable: boolean;
    onSave: (value: number) => void;
}

export default function AchievementInput({ value, editable, onSave }: Props) {
    const [draft, setDraft] = useState(value?.toString() ?? "");

    useEffect(() => {
        setDraft(value?.toString() ?? "");
    }, [value]);

    if (!editable) {
        return <span className="font-semibold text-orange-600">{value ?? "—"}</span>;
    }

    const commit = () => {
        const num = draft === "" ? null : Number(draft);
        if (num !== value && num !== null) {
            onSave(num);
        }
    };

    return (
        <input
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-16 rounded-md border border-slate-200 px-1.5 py-0.5 text-sm text-center focus:outline-none focus:border-emerald-500"
        />
    );
}