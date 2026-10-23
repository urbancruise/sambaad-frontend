"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";

import { getAllUsers, getDepartments } from "../api/team.service";
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } from "../store/teamSlice";
import type { Department, OrgUserSummary, TeamQuery } from "../types";

export const useAdminTeam = ({ page, limit, search, role, departmentId }: TeamQuery) => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, total, totalPages, loading, error } = useSelector((s: RootState) => s.adminTeam);
    const [departments, setDepartments] = useState<Department[]>([]);
    const latest = useRef(0);

    const refreshUsers = useCallback(async () => {
        const id = ++latest.current;
        dispatch(fetchUsersStart());
        try {
            const data = await getAllUsers({ page, limit, search: search || undefined, role, departmentId });
            if (id === latest.current) dispatch(fetchUsersSuccess(data));
        } catch {
            if (id === latest.current) dispatch(fetchUsersFailure("Unable to load org users."));
        }
    }, [dispatch, page, limit, search, role, departmentId]);

    useEffect(() => { refreshUsers(); }, [refreshUsers]);

    useEffect(() => {
        getDepartments().then(setDepartments).catch(() => setDepartments([]));
    }, []);

    return { users, total, totalPages, departments, loading, error, refreshUsers };
};

export const useAdminAllUsers = () => {
    const [users, setUsers] = useState<OrgUserSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getAllUsers({ page: 1, limit: 500 })
            .then((d) => { if (!cancelled) setUsers(d.items); })
            .catch(() => { if (!cancelled) setUsers([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return { users, loading };
};