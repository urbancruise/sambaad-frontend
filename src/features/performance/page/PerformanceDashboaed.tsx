"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    fetchPerformanceStart,
    fetchPerformanceSuccess,
    fetchPerformanceFailure,
} from "../store/performanceSlice";

import { usePerformance } from "../hooks/usePerformance";

import {
    getPerformanceDashboard,
    getAchievements,
    getPerformanceAnalytics,
} from "../api/performance.service";

import ScoreCard from "../components/cards/ScoreCard";
import MetricsCard from "../components/cards/MetricsCard";
import AchievementCard from "../components/cards/AchievementCard";
import AnalyticsCard from "../components/cards/AnalyticsCard";

export default function PerformanceDashboard() {

    const dispatch = useDispatch<any>();

    const {
        dashboard,
        achievements,
        analytics,
        loading,
    } = usePerformance();

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        dispatch(
            fetchPerformanceStart()
        );

        try {

            const [
                dashboardData,
                achievementData,
                analyticsData,
            ] = await Promise.all([

                getPerformanceDashboard(),

                getAchievements(),

                getPerformanceAnalytics(),

            ]);

            dispatch(

                fetchPerformanceSuccess({

                    dashboard: dashboardData,

                    achievements: achievementData,

                    analytics: analyticsData,

                })

            );

        } catch {

            dispatch(

                fetchPerformanceFailure(
                    "Unable to load performance"
                )

            );

        }

    };

    if (loading || !dashboard || !analytics) {

        return (
            <div className="py-20 text-center">
                Loading...
            </div>
        );

    }

    return (

        <div className="space-y-8">

            <ScoreCard
                scores={dashboard.scores}
            />

            <MetricsCard
                metrics={dashboard.metrics}
            />

            <AnalyticsCard
                analytics={analytics}
            />

            <AchievementCard
                achievements={achievements}
            />

        </div>

    );

}