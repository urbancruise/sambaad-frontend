"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getRatingHistory,
    submitSelfRating,
    submitSeniorRating,
    submitSuperSeniorRating,
    getFilterOptions,
} from "../api/rating.service";

import { FieldEntry, RatingFilterOptions, RatingHistory, RowType } from "../types";
import { computeOverall, emptyEntry, emptyRow, recomputeRow } from "../utils/rating.utils";

const errorMessage = (err: unknown, fallback: string) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;

const SUBMIT = {
    self: submitSelfRating,
    senior: submitSeniorRating, // L-1
    superSenior: submitSuperSeniorRating, // L-2
} as const;

export interface RatingFilterState {
    departmentId: string;
    subDepartmentId: string;
    userId: string;
    month: string; // "" = all months
    year: string; // "" = all years
}

const EMPTY_OPTIONS: RatingFilterOptions = {
    showDepartmentFilter: false,
    showSubDepartmentFilter: false,
    isTeamViewer: false,
    departments: [],
    subDepartments: [],
    users: [],
};

export const useTeamRating = ({ departmentId, subDepartmentId, userId, month, year }: RatingFilterState) => {
    const [history, setHistory] = useState<RatingHistory | null>(null);
    const [filterOptions, setFilterOptions] = useState<RatingFilterOptions>(EMPTY_OPTIONS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(
        async (opts?: { silent?: boolean }) => {
            if (!opts?.silent) setLoading(true);
            try {
                const data = await getRatingHistory({
                    department: departmentId || undefined,
                    subDepartment: subDepartmentId || undefined,
                    employeeId: userId || undefined,
                    month: month || undefined,
                    year: year || undefined,
                });
                setHistory(data);
            } catch (err) {
                setError(errorMessage(err, "Could not load ratings."));
            } finally {
                if (!opts?.silent) setLoading(false);
            }
        },
        [departmentId, subDepartmentId, userId, month, year]
    );

    // Sub-department and user options follow the selected department / sub-department.
    useEffect(() => {
        getFilterOptions(departmentId || undefined, subDepartmentId || undefined)
            .then(setFilterOptions)
            .catch(() => {});
    }, [departmentId, subDepartmentId]);

    useEffect(() => {
        load();
    }, [load]);

    /**
     * Save ONE field's rating / remarks / value for one person in one month.
     * Only that field is sent; the server merges it.
     */
    const updateEntry = useCallback(
        async (employeeId: number, period: string, rowType: RowType, fieldKey: string, patch: Partial<FieldEntry>) => {
            setError(null);

            // Optimistic update: field, module scores, total, percent and band.
            setHistory((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    cards: prev.cards.map((c) => {
                        if (c.id !== employeeId || c.period !== period) return c;

                        const row = c[rowType] ?? emptyRow;
                        const entries = {
                            ...row.fieldEntries,
                            [fieldKey]: { ...(row.fieldEntries[fieldKey] ?? emptyEntry), ...patch },
                        };
                        const nextRow = recomputeRow(row, c.fields, entries);

                        const next = { ...c, [rowType]: nextRow };
                        return {
                            ...next,
                            overall: computeOverall(c.fields, next.self, next.senior, next.superSenior),
                        };
                    }),
                };
            });

            try {
                await SUBMIT[rowType](employeeId, { period, fieldEntries: { [fieldKey]: patch } });
            } catch (err) {
                setError(errorMessage(err, "Could not save the rating."));
            } finally {
                // Re-sync with the server (also rolls back a failed save and refreshes the band counts).
                load({ silent: true });
            }
        },
        [load]
    );

    return {
        history,
        departments: filterOptions.departments,
        subDepartments: filterOptions.subDepartments,
        users: filterOptions.users,
        isTeamViewer: filterOptions.isTeamViewer,
        showDepartmentFilter: filterOptions.showDepartmentFilter,
        showSubDepartmentFilter: filterOptions.showSubDepartmentFilter,
        loading,
        error,
        clearError: () => setError(null),
        refresh: load,
        updateEntry,
    };
};
