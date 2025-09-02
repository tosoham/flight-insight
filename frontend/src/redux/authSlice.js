// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Optional persistence for UI only (server is the source of truth)
const storedUser = sessionStorage.getItem("user");
const storedRole = sessionStorage.getItem("role");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedRole || null,
  isAuthenticated: !!storedRole,
  // optional convenience to prefill login after signup:
  lastSignupEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call after a successful /check-auth (or after /login → /check-auth)
    login(state, action) {
      const { user = null, role = null } = action.payload || {};
      state.user = user;
      state.role = role;
      state.isAuthenticated = !!role;

      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      else sessionStorage.removeItem("user");

      if (role) sessionStorage.setItem("role", role);
      else sessionStorage.removeItem("role");
    },

    // Call after /logout or when /check-auth returns 401
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
    },

    // purely optional, for UI nicety after signup
    signupSuccess(state, action) {
      state.lastSignupEmail = action.payload?.email || null;
    },

   
  },
});

export const { login, logout, signupSuccess } = authSlice.actions;
export default authSlice.reducer;

// tiny selectors
export const selectUser = (s) => s.auth.user;
export const selectRole = (s) => s.auth.role;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectLastSignupEmail = (s) => s.auth.lastSignupEmail;
