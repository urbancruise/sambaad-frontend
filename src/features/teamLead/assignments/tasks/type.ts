export interface TeamTask {

    id: string;

    title: string;

    description: string | null;

    priority: string;

    status: string;

    progress: number;

    startDate: string;

    dueDate: string;

    estimatedHours: number | null;

    goal: {

        id: string;

        title: string;

    };

    assignedTo: {

        id: string;

        fullName: string;

    };

}

export interface CreateTaskRequest {

    goalId: string;

    assignedToId: string;

    title: string;

    description?: string;

    priority: string;

    startDate: string;

    dueDate: string;

    estimatedHours?: number;

}