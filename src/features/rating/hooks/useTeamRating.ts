"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getTeamRating,
    submitSelfRating,
    submitSeniorRating,
    getDepartments,
} from "../api/rating.service";

import { TeamRating, Department } from "../types";

export const useTeamRating = (departmentId: string, month: number, year: number) => {
    const [team, setTeam] = useState<TeamRating | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const period = `${year}-${String(month).padStart(2, "0")}`;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTeamRating({ department: departmentId || undefined, period });
            setTeam(data);
        } finally {
            setLoading(false);
        }
    }, [departmentId, period]);

    useEffect(() => {
        getDepartments().then(setDepartments).catch(() => setDepartments([]));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const updateField = useCallback(
        async (
            employeeId: number,
            rowType: "self" | "senior",
            patch: Record<string, any>
        ) => {
            if (!team) return;

            const emp = team.employees.find((e) => e.id === employeeId);
            const currentRow = emp?.[rowType] ?? {
                salesScore: null,
                conductScore: null,
                contributionScore: null,
                achievementPercent: null,
                extraFields: {},
                total: 0,
                updatedAt: "",
                raterId: 0,
            };

            const fullPayload = {
                period,
                salesScore: currentRow.salesScore,
                conductScore: currentRow.conductScore,
                contributionScore: currentRow.contributionScore,
                achievementPercent: currentRow.achievementPercent,
                extraFields: currentRow.extraFields,
                ...patch,
            };

            setTeam((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    employees: prev.employees.map((e) => {
                        if (e.id !== employeeId) return e;
                        return { ...e, [rowType]: { ...currentRow, ...patch } };
                    }),
                };
            });

            const submit = rowType === "self" ? submitSelfRating : submitSeniorRating;

            try {
                await submit(employeeId, fullPayload as any);
            } finally {
                load();
            }
        },
        [team, period, load]
    );

    return {
        team,
        departments,
        loading,
        refresh: load,
        updateField,
    };
};