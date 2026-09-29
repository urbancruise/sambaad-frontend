export interface EmployeeProfile {

    profile: {

        id: string;

        fullName: string;

        email: string;

        username: string;

        role: string;

        isActive: boolean;

    };

    overview: {

        totalGoals: number;

        completedGoals: number;

        totalTasks: number;

        completedTasks: number;

        totalActivities: number;

        completedActivities: number;

        pendingActivities: number;

        overdueActivities: number;

    };

    performance: {

        performanceScore: number;

        completionRate: number;

        productivityScore: number;

    };

}