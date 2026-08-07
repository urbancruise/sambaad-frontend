"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Undo, Redo } from "lucide-react";

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your message..." }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    // Only sync from prop on first mount (e.g. loading a draft) — after
    // that, the DOM is the source of truth while typing, so we don't
    // fight the browser's own cursor position on every keystroke.
    useEffect(() => {
        if (isFirstRender.current && ref.current) {
            ref.current.innerHTML = value || "";
            isFirstRender.current = false;
        }
    }, [value]);

    const exec = (command: string, arg?: string) => {
        document.execCommand(command, false, arg);
        ref.current?.focus();
        handleInput();
    };

    const handleInput = () => {
        if (ref.current) onChange(ref.current.innerHTML);
    };

    const handleLink = () => {
        const url = prompt("Enter URL:");
        if (url) exec("createLink", url);
    };

    const toolbarBtn = (icon: React.ReactNode, command: string, arg?: string, title?: string) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // keep focus/selection in the editor
            onClick={() => exec(command, arg)}
            title={title}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition"
        >
            {icon}
        </button>
    );

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                {toolbarBtn(<Bold size={15} />, "bold", undefined, "Bold")}
                {toolbarBtn(<Italic size={15} />, "italic", undefined, "Italic")}
                {toolbarBtn(<Underline size={15} />, "underline", undefined, "Underline")}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                {toolbarBtn(<List size={15} />, "insertUnorderedList", undefined, "Bullet list")}
                {toolbarBtn(<ListOrdered size={15} />, "insertOrderedList", undefined, "Numbered list")}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleLink}
                    title="Insert link"
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                >
                    <LinkIcon size={15} />
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                {toolbarBtn(<Undo size={15} />, "undo", undefined, "Undo")}
                {toolbarBtn(<Redo size={15} />, "redo", undefined, "Redo")}
            </div>

            <div
                ref={ref}
                contentEditable
                onInput={handleInput}
                data-placeholder={placeholder}
                className="min-h-[200px] max-h-[400px] overflow-y-auto px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400"
                suppressContentEditableWarning
            />
        </div>
    );
}