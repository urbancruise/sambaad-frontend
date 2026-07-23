export type Priority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export type TaskStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type GoalType =
    | "LONG_TERM"
    | "ONGOING"
    | "URGENT";

export interface GoalSummary {
    id: string;
    title: string;
    goalType: GoalType;
}

export interface Task {
    id: string;

    goalId: string;

    title: string;

    description?: string;

    priority: Priority;

    status: TaskStatus;

    progress: number;

    estimatedHours?: number | null;

    startDate: string;

    dueDate: string;

    completedAt?: string | null;

    createdById: number;

    assignedToId: number;

    createdAt: string;

    updatedAt: string;

    goal: GoalSummary;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface TaskResponse {
    tasks: Task[];
    pagination: Pagination;
}