import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/slices/authSlice";
import navigationReducer from "./features/navigation/navigationSlice";
import taskReducer from "./../features/tasks/store/taskSlice";
import dashboardReducer from "../features/dashboard/store/dashboardSlice";
import goalReducer from "@/src/features/goals/store/goalSlice";
import activityReducer from "@/src/features/activities/store/activitySlice";
import notificationReducer from "@/src/features/notifications/store/notificationSlice";
import calendarReducer from "@/src/features/calendar/store/calendarSlice";
import performanceReducer from "../features/performance/store/performanceSlice";
import teamLeadDashboardReducer from "@/src/features/teamLead/store/teamLeadDashboardSlice";
import teamReducer from "@/src/features/teamLead/team/store/teamSlice";
import profileReducer from '@/src/features/teamLead/profile/store/profileSlice'
import employeeGoalsReducer from "@/src/features/teamLead/profile/goals/store/goalSlice";
import employeeTasksReducer from "@/src/features/teamLead/profile/tasks/store/taskSlice";
import employeeActivitiesReducer from "@/src/features/teamLead/profile/activities/store/activitySlice";
import employeeTimelineReducer from "@/src/features/teamLead/profile/timeline/store/timelineSlice";
import teamLeadGoalReducer from "@/src/features/teamLead/assignments/goals/store/goalSlice";
import teamMembersReducer from "@/src/features/teamLead/assignments/shared/store/teamSlice";
import teamLeadTaskReducer from "@/src/features/teamLead/assignments/tasks/store/taskSlice";
import selectableGoalReducer from "@/src/features/teamLead/assignments/shared/store/selectableGoalSlice";
import selectableTaskReducer from "@/src/features/teamLead/assignments/shared/store/selectableTaskSlice";
import managerTeamReducer from "@/src/features/manager/team/store/teamSlice";
import managerTeamLeadProfileReducer from "@/src/features/manager/profile/store/profileSlice";
import managerTeamLeadGoalsReducer from "@/src/features/manager/profile/goals/store/goalSlice";
import managerTeamLeadTasksReducer from "@/src/features/manager/profile/tasks/store/taskSlice";
import managerTeamLeadActivitiesReducer from "@/src/features/manager/profile/activities/store/activitySlice";
import hodTeamReducer from "@/src/features/hod/team/store/teamSlice";
import hodTeamLeadProfileReducer from "@/src/features/hod/profile/store/profileSlice";
import hodTeamLeadGoalsReducer from "@/src/features/hod/profile/goals/store/goalSlice";
import hodTeamLeadTasksReducer from "@/src/features/hod/profile/tasks/store/taskSlice";
import hodTeamLeadActivitiesReducer from "@/src/features/hod/profile/activities/store/activitySlice";
import adminTeamReducer from "@/src/features/admin/team/store/teamSlice";
import adminUserProfileReducer from "@/src/features/admin/profile/store/profileSlice";
import adminUserGoalsReducer from "@/src/features/admin/profile/goals/store/goalSlice";
import adminUserTasksReducer from "@/src/features/admin/profile/tasks/store/taskSlice";
import adminUserActivitiesReducer from "@/src/features/admin/profile/activities/store/activitySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      navigation: navigationReducer,
      dashboard: dashboardReducer,
      teamLeadDashboard: teamLeadDashboardReducer,
      goals: goalReducer,
      task: taskReducer,
      performance: performanceReducer,
      calendar: calendarReducer,
      activities: activityReducer,
      notification: notificationReducer,
      team: teamReducer,
      employeeProfile: profileReducer,
      employeeGoals: employeeGoalsReducer,
      employeeTasks: employeeTasksReducer,
      employeeActivities: employeeActivitiesReducer,
      employeeTimeline: employeeTimelineReducer,
      teamLeadGoals: teamLeadGoalReducer,
      teamMembers: teamMembersReducer,
      teamLeadTasks: teamLeadTaskReducer,
      selectableGoals: selectableGoalReducer,
      selectableTasks: selectableTaskReducer,
      managerTeam: managerTeamReducer,
      managerTeamLeadProfile: managerTeamLeadProfileReducer,
      managerTeamLeadGoals: managerTeamLeadGoalsReducer,
      managerTeamLeadTasks: managerTeamLeadTasksReducer,
      managerTeamLeadActivities: managerTeamLeadActivitiesReducer,
      hodTeam: hodTeamReducer,
      hodTeamLeadProfile: hodTeamLeadProfileReducer,
      hodTeamLeadGoals: hodTeamLeadGoalsReducer,
      hodTeamLeadTasks: hodTeamLeadTasksReducer,
      hodTeamLeadActivities: hodTeamLeadActivitiesReducer,
      adminTeam: adminTeamReducer,
      adminUserProfile: adminUserProfileReducer,
      adminUserGoals: adminUserGoalsReducer,
      adminUserTasks: adminUserTasksReducer,
      adminUserActivities: adminUserActivitiesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();