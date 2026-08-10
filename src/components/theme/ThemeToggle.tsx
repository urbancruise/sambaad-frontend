"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/src/components/theme/ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-xl text-slate-100 hover:bg-slate-800/30 dark:hover:bg-white/10 transition-colors"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}