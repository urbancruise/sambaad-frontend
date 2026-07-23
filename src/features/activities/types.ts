export type ActivityStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type Priority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export interface Activity {

    id: string;

    taskId: string;

    title: string;

    description?: string;

    priority: Priority;

    status: ActivityStatus;

    progress: number;

    startDate: string;

    dueDate: string;

    completedAt?: string | null;

    createdById: number;
    assignedToId: number;

    createdAt: string;
    updatedAt: string;

    task?: {

        id: string;

        title: string;

    };

}

export interface ActivityResponse {

    activities: Activity[];

    pagination: {

        page: number;

        limit: number;

        total: number;

        totalPages: number;

    };

}
