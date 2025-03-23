import {
  GET_AREAS,
  GET_AREAS_FAIL,
  GET_AREAS_SUCCESS,
  ADD_NEW_AREA,
  ADD_AREA_SUCCESS,
  ADD_AREA_FAIL,
  UPDATE_AREA,
  UPDATE_AREA_SUCCESS,
  UPDATE_AREA_FAIL,
  DELETE_AREA,
  DELETE_AREA_SUCCESS,
  DELETE_AREA_FAIL
} from "./actionTypes"

export const getAreas = (filter) => ({
  type: GET_AREAS,
  payload: filter,
})

export const getAreasSuccess = areas => ({
  type: GET_AREAS_SUCCESS,
  payload: areas,
})

export const getAreasFail = error => ({
  type: GET_AREAS_FAIL,
  payload: error,
})

export const addNewArea = area => ({
  type: ADD_NEW_AREA,
  payload: area,
})

export const addAreaSuccess = area => ({
  type: ADD_AREA_SUCCESS,
  payload: area,
})

export const addAreaFail = error => ({
  type: ADD_AREA_FAIL,
  payload: error,
})

export const updateArea = area => ({
  type: UPDATE_AREA,
  payload: area,
})

export const updateAreaSuccess = area => ({
  type: UPDATE_AREA_SUCCESS,
  payload: area,
})

export const updateAreaFail = error => ({
  type: UPDATE_AREA_FAIL,
  payload: error,
})

export const deleteArea = area => ({
  type: DELETE_AREA,
  payload: area,
})

export const deleteAreaSuccess = area => ({
  type: DELETE_AREA_SUCCESS,
  payload: area,
})

export const deleteAreaFail = error => ({
  type: DELETE_AREA_FAIL,
  payload: error,
})
