/**
 * Single place that describes how each role differs.
 *
 * Everything else in this feature (components, hooks, store, create/update/
 * delete calls) is identical for every role. The ONLY thing that changes is
 * the backend prefix used for the read endpoints:
 *
 *   GET {basePath}/:employeeId
 *   GET {basePath}/:employeeId/goals | tasks | activities | timeline
 *
 * Adding a new role = add one line here.
 */
export type ProfileRole = "admin" | "hod" | "manager";

export interface ProfileRoleConfig {
    basePath: string;
}

export const PROFILE_ROLE_CONFIG: Record<ProfileRole, ProfileRoleConfig> = {
    admin: { basePath: "/admin/team" },
    hod: { basePath: "/hod/team" },
    manager: { basePath: "/manager/team" },
};
