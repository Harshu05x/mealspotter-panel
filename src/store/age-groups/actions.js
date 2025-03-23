import {
  GET_AGEGROUPS,
  GET_AGEGROUPS_FAIL,
  GET_AGEGROUPS_SUCCESS,
  ADD_NEW_AGEGROUP,
  ADD_AGEGROUP_SUCCESS,
  ADD_AGEGROUP_FAIL,
  UPDATE_AGEGROUP,
  UPDATE_AGEGROUP_SUCCESS,
  UPDATE_AGEGROUP_FAIL,
  DELETE_AGEGROUP,
  DELETE_AGEGROUP_SUCCESS,
  DELETE_AGEGROUP_FAIL
} from "./actionTypes"

export const getAgeGroups = () => ({
  type: GET_AGEGROUPS,
})

export const getAgeGroupsSuccess = categories => ({
  type: GET_AGEGROUPS_SUCCESS,
  payload: categories,
})

export const getAgeGroupsFail = error => ({
  type: GET_AGEGROUPS_FAIL,
  payload: error,
})

export const addNewAgeGroup = agegroup => ({
  type: ADD_NEW_AGEGROUP,
  payload: agegroup,
})

export const addAgeGroupSuccess = agegroup => ({
  type: ADD_AGEGROUP_SUCCESS,
  payload: agegroup,
})

export const addAgeGroupFail = error => ({
  type: ADD_AGEGROUP_FAIL,
  payload: error,
})

export const updateAgeGroup = agegroup => ({
  type: UPDATE_AGEGROUP,
  payload: agegroup,
})

export const updateAgeGroupSuccess = agegroup => ({
  type: UPDATE_AGEGROUP_SUCCESS,
  payload: agegroup,
})

export const updateAgeGroupFail = error => ({
  type: UPDATE_AGEGROUP_FAIL,
  payload: error,
})

export const deleteAgeGroup = agegroup => ({
  type: DELETE_AGEGROUP,
  payload: agegroup,
})

export const deleteAgeGroupSuccess = agegroup => ({
  type: DELETE_AGEGROUP_SUCCESS,
  payload: agegroup,
})

export const deleteAgeGroupFail = error => ({
  type: DELETE_AGEGROUP_FAIL,
  payload: error,
})
