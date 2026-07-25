"use client";

import UserCard from "./UserCard";
import { OrgUserSummary } from "../types";

interface Props {
    users: OrgUserSummary[];
    loading: boolean;
}

export default function UserTable({ users, loading }: Props) {
    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                Loading users...
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-700">No Users Found</h3>
                <p className="mt-2 text-sm text-slate-500">
                    Try adjusting your search or role filter.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {users.map((u) => (
                <UserCard key={u.id} user={u} />
            ))}
        </div>
    );
}