export interface Goal {
    id: string;
    title: string;
    description?: string;

    goalType: "LONG_TERM" | "ONGOING" | "URGENT";

    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

    progress: number;

    startDate: string;
    dueDate: string;

    createdById: string;
    assignedToId: string;

    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GoalState {
    goals: Goal[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}