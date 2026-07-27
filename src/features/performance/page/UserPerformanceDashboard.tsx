"use client";

import { useEffect, useState } from "react";

import {
    getUserPerformanceDashboard,
    getUserAchievements,
    getUserPerformanceAnalytics,
} from "../api/userPerformance.service";

import ScoreCard from "../components/cards/ScoreCard";
import MetricsCard from "../components/cards/MetricsCard";
import AnalyticsCard from "../components/cards/AnalyticsCard";
import AchievementCard from "../components/cards/AchievementCard";

import {
    PerformanceDashboard,
    Achievement,
    PerformanceAnalytics,
} from "../types";

interface Props {
    /** The profile owner's id — NOT necessarily the logged-in user. */
    userId: string | number;
}

/**
 * Same visual layout as the self-view PerformanceDashboaed, but fetches
 * an arbitrary user's data via the /performance/:userId/* endpoints
 * (gated server-side by isSelfOrSubordinate) instead of /performance/*
 * (always self). Uses local state rather than the shared performanceSlice
 * so viewing a subordinate's performance never clobbers your own.
 */
export default function UserPerformanceDashboard({ userId }: Props) {
    const [dashboard, setDashboard] = useState<PerformanceDashboard | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [dashboardData, achievementData, analyticsData] = await Promise.all([
                    getUserPerformanceDashboard(String(userId)),
                    getUserAchievements(String(userId)),
                    getUserPerformanceAnalytics(String(userId)),
                ]);

                if (cancelled) return;
                setDashboard(dashboardData);
                setAchievements(achievementData);
                setAnalytics(analyticsData);
            } catch {
                if (!cancelled) setError("Unable to load performance data.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (loading || !dashboard || !analytics) {
        return (
            <div className="py-20 text-center">
                Loading performance...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 p-5 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ScoreCard scores={dashboard.scores} />
            <MetricsCard metrics={dashboard.metrics} />
            <AnalyticsCard analytics={analytics} />
            <AchievementCard achievements={achievements} />
        </div>
    );
}