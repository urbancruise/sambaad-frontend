"use client";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

const pagesToShow = (page: number, totalPages: number): (number | "…")[] => {
  const set = new Set([1, totalPages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
};

export default function Pagination({ page, totalPages, total, limit, onChange }: Props) {
  if (total === 0) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const btn = "rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 dark:border-slate-700";

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button className={`${btn} bg-white hover:bg-slate-50 dark:bg-slate-900`} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        {pagesToShow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`${btn} ${p === page ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50 dark:bg-slate-900"}`}
            >
              {p}
            </button>
          )
        )}
        <button className={`${btn} bg-white hover:bg-slate-50 dark:bg-slate-900`} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}