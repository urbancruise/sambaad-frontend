export interface EmployeeGoal {

    id: string;

    title: string;

    description?: string;

    goalType: string;

    priority: string;

    status: string;

    progress: number;

    startDate: string;

    dueDate: string;

    createdById: number;

    assignedToId: number;

    taskCount: number;

    completedTasks: number;

}