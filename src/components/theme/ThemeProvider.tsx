"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }) {
    // Start as light on the server and during first client render to
    // avoid a hydration mismatch — the real preference (localStorage or
    // system) is applied in the effect below, right after mount.
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial: Theme = stored ?? (systemPrefersDark ? "dark" : "light");

        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const next: Theme = prev === "dark" ? "light" : "dark";
            localStorage.setItem("theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* Avoids a flash of the wrong theme before the effect above
                runs — children render invisibly for one frame, not with
                the wrong colors. */}
            <div style={{ visibility: mounted ? "visible" : "hidden" }}>{children}</div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};