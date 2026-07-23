export interface PerformanceScores {

    goalScore: number;

    taskScore: number;

    activityScore: number;

    onTimeScore: number;

    productivityScore: number;

    performanceScore: number;

}

export interface PerformanceMetrics {

    goals: number;

    completedGoals: number;

    tasks: number;

    completedTasks: number;

    activities: number;

    completedActivities: number;

    overdueActivities: number;

    onTimeActivities: number;

}

export interface PerformanceDashboard {

    scores: PerformanceScores;

    metrics: PerformanceMetrics;

}

export interface Achievement {

    id: string;

    title: string;

    description?: string;

    badge?: string;

    createdAt: string;
    level: string;

    points: number;

    unlockedAt: string;

}

export interface AnalyticsTrend {

    period: string;

    performanceScore: number;

    completionRate: number;

    productivityScore: number;

}

export interface AnalyticsSummary {

    averagePerformance: number;

    highestPerformance: number;

    lowestPerformance: number;

}

export interface PerformanceAnalytics {

    trend: AnalyticsTrend[];

    summary: AnalyticsSummary;

}