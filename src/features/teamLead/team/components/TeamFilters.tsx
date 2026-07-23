"use client";

interface Props {
  search: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
  onSearch: (value: string) => void;
  onStatusChange: (value: "ALL" | "ACTIVE" | "INACTIVE") => void;
}

export default function TeamFilters({
  search,
  status,
  onSearch,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input with Icon */}
      <div className="relative w-full sm:max-w-xs">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1">
        {(["ALL", "ACTIVE", "INACTIVE"] as const).map((item) => (
          <button
            key={item}
            onClick={() => onStatusChange(item)}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition ${
              status === item
                ? "bg-[#0F172A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {item.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}