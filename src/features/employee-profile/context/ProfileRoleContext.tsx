"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
    PROFILE_ROLE_CONFIG,
    type ProfileRole,
    type ProfileRoleConfig,
} from "../config/roleConfig";

interface ProfileRoleContextValue extends ProfileRoleConfig {
    role: ProfileRole;
}

const ProfileRoleContext = createContext<ProfileRoleContextValue | null>(null);

export function ProfileRoleProvider({
    role,
    children,
}: {
    role: ProfileRole;
    children: ReactNode;
}) {
    const value = useMemo(
        () => ({ role, ...PROFILE_ROLE_CONFIG[role] }),
        [role]
    );

    return (
        <ProfileRoleContext.Provider value={value}>
            {children}
        </ProfileRoleContext.Provider>
    );
}

/**
 * Returns { role, basePath } for the profile currently being viewed.
 * Throws if used outside <EmployeeProfilePage role="..." /> so a missing
 * role fails loudly instead of silently calling the wrong endpoint.
 */
export function useProfileRole(): ProfileRoleContextValue {
    const ctx = useContext(ProfileRoleContext);
    if (!ctx) {
        throw new Error(
            "useProfileRole must be used inside <EmployeeProfilePage role=\"...\" />"
        );
    }
    return ctx;
}
