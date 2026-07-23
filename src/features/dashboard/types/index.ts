export interface DashboardOverview {
  totalGoals: number;
  completedGoals: number;
  totalTasks: number;
  completedTasks: number;
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  inProgressActivities: number;
  overdueActivities: number;
}

export interface DashboardToday {
  todayTasks: number;
  todayActivities: number;
  dueToday: number;
  missedYesterday: number;
  workingMinutes: number;
}

export interface DashboardAnalytics {
  goalProgress: number;
  taskProgress: number;
  activityProgress: number;
}

export interface DashboardPerformance {
  completionRate: number;
  productivityScore: number;
  efficiencyScore: number;
  delayRate: number;
  performanceScore: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  action: string;
  time: string;
  status: string;
}

export interface RecentActivity {
    id: string;
    title: string;

    status: string;
    progress: number;

    updatedAt: string;

    task: {
        id: string;
        title: string;
    };
}

export interface DeadlineItem {
  id: string;
  title: string;
  priority: string;
  dueDate: string;
  progress: number;
  task: {
    title: string;
  };
}

export interface DashboardDeadlines {
  overdue: DeadlineItem[];
  today: DeadlineItem[];
  tomorrow: DeadlineItem[];
  thisWeek: DeadlineItem[];
}

export interface TodayActivity {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
}

export interface TodayTask {
    id: string;
    title: string;
    priority: string;
    progress: number;
    dueDate: string;
    activities: TodayActivity[];
}

export interface TodayGoal {
    id: string;
    title: string;
    goalType: string;
    progress: number;
    dueDate: string;
    status: string;
    tasks: TodayTask[];
}

export interface EmployeeDashboard {
  overview: DashboardOverview;
  today: DashboardToday;
  analytics: DashboardAnalytics;
  performance: DashboardPerformance;
  timeline: TimelineItem[];
  recentActivities: RecentActivity[];
  deadlines: DashboardDeadlines;
  todayWork: TodayGoal[];
}

export interface TeamActivity {
    id: string;
    title: string;
    status: string;
    completed: boolean;
}

export interface TeamTask {
    id: string;
    title: string;
    status: string;
    priority: string;
    progress: number;
    activities: TeamActivity[];
}

export interface DashboardData {
    goal: any;
    task: any;
    activity: any;
}

