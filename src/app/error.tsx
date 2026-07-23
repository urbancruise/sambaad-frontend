"use client";

import { useEffect } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely for debugging
    console.error("Critical Client Exception Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertTriangle size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
          <p className="text-sm text-slate-500">
            {error.message || "An unexpected error occurred while loading this page."}
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>Reload Section</span>
        </button>
      </div>
    </div>
  );
}