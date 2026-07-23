export interface EmployeeTimeline {

    id: string;

    action: string;

    remarks: string | null;

    createdAt: string;

    user: {

        id: string;

        fullName: string;

    };

    activity: {

        id: string;

        title: string;

        task: {

            title: string;

            goal: {

                title: string;

            };

        };

    };

}