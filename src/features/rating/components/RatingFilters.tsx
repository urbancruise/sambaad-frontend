"use client";

import { Department } from "../types";

interface Props {
    departments: Department[];
    departmentId: string;
    onDepartmentChange: (id: string) => void;
    month: number;
    year: number;
    onMonthChange: (m: number) => void;
    onYearChange: (y: number) => void;
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function RatingFilters({
    departments,
    departmentId,
    onDepartmentChange,
    month,
    year,
    onMonthChange,
    onYearChange,
}: Props) {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    const selectClasses = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-400";

    return (
        <div className="flex flex-wrap gap-3">
            <select
                value={departmentId}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className={selectClasses}
            >
                <option value="">All Departments</option>
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.department_name.toUpperCase()}</option>
                ))}
            </select>

            <select
                value={month}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className={selectClasses}
            >
                {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                ))}
            </select>

            <select
                value={year}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className={selectClasses}
            >
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    );
}