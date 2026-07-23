import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "ADMIN" |"HOD" | "MANAGER" | "TEAM_LEAD" | "EMPLOYEE";
  
}

interface AuthState {
  user: User | null;

  isAuthenticated: boolean;

  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
    },

    loginSuccess(
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) {
      state.loading = false;
      
      state.user = action.payload.user;
      
      state.isAuthenticated = true;
    },
    
    loginFailure(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;