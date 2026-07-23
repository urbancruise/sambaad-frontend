import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MenuType =
  | "dashboard"
  | "goals"
  | "tasks"
  | "activities"
  | "calendar"
  | "notifications"
  | "performance"
  | "achievements"
  | "profile";

interface NavigationState {
  sidebarCollapsed: boolean;
  activeMenu: MenuType;
}

const initialState: NavigationState = {
  sidebarCollapsed: false,
  activeMenu: "dashboard",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveMenu(state, action: PayloadAction<MenuType>) {
      state.activeMenu = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    collapseSidebar(state) {
      state.sidebarCollapsed = true;
    },

    expandSidebar(state) {
      state.sidebarCollapsed = false;
    },
  },
});

export const {
  setActiveMenu,
  toggleSidebar,
  collapseSidebar,
  expandSidebar,
} = navigationSlice.actions;

export default navigationSlice.reducer;