export interface TeamMember {

    id: string;

    fullName: string;

    email: string;

    role: string;

}

export interface SelectableGoal {

    id: string;

    title: string;

    assignedTo: {

        id: string;

        fullName: string;

    };

}

export interface SelectableTask {

    id: string;

    title: string;

    goalId: string;

    assignedTo: {

        id: string;

        fullName: string;

    };

}