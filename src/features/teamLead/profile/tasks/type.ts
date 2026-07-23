export interface EmployeeTask {

    id: string;

    title: string;

    description?: string;

    priority: string;

    status: string;

    progress: number;

    startDate: string;

    dueDate: string;

    estimatedHours: number | null;

    createdById: number;

    assignedToId: number;

    goal: {

        id: string;

        title: string;

    };

    activityCount: number;

    completedActivities: number;

}