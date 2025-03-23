import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, UPDATE_USER_PASSWORD } from "./actionTypes"
import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_ERROR,
} from "./actionTypes"


export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  }
}

export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  }
}

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  }
}

export const resetProfileFlag = error => {
  return {
    type: RESET_PROFILE_FLAG,
  }
}

export const getUserProfile = () => {
  return {
    type: GET_USER_PROFILE,
  }
}

export const getUserProfileSuccess = user => {
  return {
    type: GET_USER_PROFILE_SUCCESS,
    payload: user,
  }
}

export const getUserProfileError = error => {
  return {
    type: GET_USER_PROFILE_ERROR,
    payload: error,
  }
}

export const updateUserPassword = data => {
  return {
    type: UPDATE_USER_PASSWORD,
    payload: data,
  }
}