export interface TeamGoal {

    id: string;

    title: string;

    description: string | null;

    status: string;

    priority: string;

    progress: number;

    startDate: string;

    dueDate: string;

    estimatedHours: number | null;

    assignedTo: {

        id: string;

        fullName: string;

    };

}

export interface CreateGoalRequest {

    assignedToId: string;

    title: string;

    description?: string;

    priority: string;

    startDate: string;

    dueDate: string;

    estimatedHours?: number;

}