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
}