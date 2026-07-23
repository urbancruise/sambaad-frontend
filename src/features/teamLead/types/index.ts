export interface TeamLeadOverview {

    totalEmployees:number;

    activeEmployees:number;

    totalGoals:number;

    completedGoals:number;

    totalTasks:number;

    completedTasks:number;

    totalActivities:number;

    completedActivities:number;

    overdueActivities:number;

}


export interface TeamPerformance {

    averagePerformance:number;

    averageCompletion:number;

    averageProductivity:number;

}


export interface EmployeeWorkload {

    employeeId:string;

    employeeName:string;

    activeTasks:number;

    pendingActivities:number;

    overdueActivities:number;

}


export interface TeamLeaderboard {

    employeeId:string;

    employeeName:string;

    performanceScore:number;

    completionRate:number;

    productivityScore:number;

    completedActivities:number;

    completedTasks:number;

}


export interface ActivityFeed {

    id:string;

    employee:string;

    activity:string;

    task:string;

    status:string;

    priority:string;

    updatedAt:string;

}


export interface DeadlineItem {

    id:string;

    title:string;

    employee:string;

    task:string;

    priority:string;

    dueDate:string;

}


export interface TeamLeadDashboard {

    overview:TeamLeadOverview;

    performance:TeamPerformance;

    workload:EmployeeWorkload[];

    topPerformers:TeamLeaderboard[];

    needsAttention:TeamLeaderboard[];

    activityFeed:ActivityFeed[];

    deadlines:{
        overdue:DeadlineItem[];
        today:DeadlineItem[];
        tomorrow:DeadlineItem[];
        thisWeek:DeadlineItem[];
    };

}