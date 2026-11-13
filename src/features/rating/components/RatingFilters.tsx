"use client";

import { Department, RatingUser, SubDepartment } from "../types";

interface Props {
    departments: Department[];
    departmentId: string;
    onDepartmentChange: (id: string) => void;
    subDepartments: SubDepartment[];
    subDepartmentId: string;
    onSubDepartmentChange: (id: string) => void;
    showDepartment: boolean;
    showSubDepartment: boolean;
    subDepartmentDisabled: boolean;
    // Team viewers (TL / manager / admin) get the user + month/year filters.
    showUser: boolean;
    users: RatingUser[];
    userId: string;
    onUserChange: (id: string) => void;
    showPeriod: boolean;
    month: string; // "" = all months
    year: string; // "" = all years
    onMonthChange: (m: string) => void;
    onYearChange: (y: string) => void;
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function RatingFilters({
    departments,
    departmentId,
    onDepartmentChange,
    subDepartments,
    subDepartmentId,
    onSubDepartmentChange,
    showDepartment,
    showSubDepartment,
    subDepartmentDisabled,
    showUser,
    users,
    userId,
    onUserChange,
    showPeriod,
    month,
    year,
    onMonthChange,
    onYearChange,
}: Props) {
    // Ratings can't be submitted for future periods, so don't offer them.
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear];

    const selectClasses =
        "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-400";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {showDepartment && (
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
            )}

            {showSubDepartment && (
                <select
                    value={subDepartmentId}
                    disabled={subDepartmentDisabled}
                    onChange={(e) => onSubDepartmentChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="">
                        {subDepartmentDisabled ? "Select a department first" : "All Sub-departments"}
                    </option>
                    {subDepartments.map((s) => (
                        <option key={s.id} value={s.id}>
                            {(s.name ?? `Sub-department ${s.id}`).toUpperCase()}
                        </option>
                    ))}
                </select>
            )}

            {showUser && (
                <select
                    value={userId}
                    onChange={(e) => onUserChange(e.target.value)}
                    className={`${selectClasses} max-w-48`}
                >
                    <option value="">All Users</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            )}

            {showPeriod && (
                <>
                    <select
                        value={month}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className={selectClasses}
                    >
                        <option value="">All Months</option>
                        {MONTHS.map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => onYearChange(e.target.value)}
                        className={selectClasses}
                    >
                        <option value="">All Years</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}
