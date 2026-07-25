export interface TeamLeadSummary {
    id: number;
    fullName: string;
    email: string;
    username: string;
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