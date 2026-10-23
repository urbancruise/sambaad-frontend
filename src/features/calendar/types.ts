export type CalendarType = "GOAL" | "TASK" | "ACTIVITY";

export interface CalendarEvent {
    id: string;
    type: CalendarType;
    title: string;
    status: string;
    priority: string;
    progress: number;
    start: string;
    end: string | null;
    description: string | null;
    assignedToId: number | null;
    assigneeName: string | null;
    parentTitle: string | null;
}

export interface CalendarAnalytics {
    summary: {
        totalGoals: number;
        totalTasks: number;
        totalActivities: number;
        completedActivities: number;
        pendingActivities: number;
        overdueActivities: number;
        completionRate: number;
    };
    workload: { date: string; activities: number }[];
    upcomingDeadlines: { title: string; dueDate: string }[];
}