import { SYSTEM_ERROR, SYSTEM_LOADING } from "./actionTypes";

export const setSystemLoading = (loading) => ({
  type: SYSTEM_LOADING,
  payload: loading,
});

export const setSystemError = (error) => ({
  type: SYSTEM_ERROR,
  payload: error,
});