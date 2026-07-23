export interface TeamMember {

    id: string;

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

    pendingActivities: number;

    overdueActivities: number;

}