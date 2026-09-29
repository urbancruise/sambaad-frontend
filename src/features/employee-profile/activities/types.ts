export interface EmployeeActivity {

    id: string;

    title: string;

    description?: string;

    priority: string;

    status: string;

    progress: number;

    estimatedMinutes: number | null;

    actualMinutes: number | null;

    startedAt: string | null;

    completedAt: string | null;

    dueDate: string | null;

    createdById: number;

    assignedToId: number;

    task: {

        id: string;

        title: string;

    };

    goal: {

        id: string;

        title: string;

    };

}