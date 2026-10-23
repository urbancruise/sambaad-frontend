export type UserRole = "SUPER_ADMIN" | "HOD" | "ZONAL_HEAD" | "MANAGER" | "TEAM_LEAD" | "EMPLOYEE";

export interface OrgUserSummary {
    id: number;
    fullName: string;
    email: string;
    username: string;
    role: UserRole;
    managerId: number | null;
    isActive: boolean;
    performanceScore: number;
    totalGoals: number;
    completedGoals: number;
    totalTasks: number;
    completedTasks: number;
    totalActivities: number;
    completedActivities: number;
    overdueActivities: number;
    avatarUrl? : string;
     departmentId: number | null;
    departmentName: string | null;
    manager: { id: number; fullName: string; departmentName: string | null } | null;
}
export interface Department { id: number; name: string }

export interface PaginatedUsers {
    items: OrgUserSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TeamQuery {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    departmentId?: number;
}