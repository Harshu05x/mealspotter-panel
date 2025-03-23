import {
  GET_ZONES,
  GET_ZONES_FAIL,
  GET_ZONES_SUCCESS,
  ADD_NEW_ZONE,
  ADD_ZONE_SUCCESS,
  ADD_ZONE_FAIL,
  UPDATE_ZONE,
  UPDATE_ZONE_SUCCESS,
  UPDATE_ZONE_FAIL,
  DELETE_ZONE,
  DELETE_ZONE_SUCCESS,
  DELETE_ZONE_FAIL
} from "./actionTypes"

export const getZones = () => ({
  type: GET_ZONES,
})

export const getZonesSuccess = zones => ({
  type: GET_ZONES_SUCCESS,
  payload: zones,
})

export const getZonesFail = error => ({
  type: GET_ZONES_FAIL,
  payload: error,
})

export const addNewZone = category => ({
  type: ADD_NEW_ZONE,
  payload: category,
})

export const addZoneSuccess = category => ({
  type: ADD_ZONE_SUCCESS,
  payload: category,
})

export const addZoneFail = error => ({
  type: ADD_ZONE_FAIL,
  payload: error,
})

export const updateZone = category => ({
  type: UPDATE_ZONE,
  payload: category,
})

export const updateZoneSuccess = category => ({
  type: UPDATE_ZONE_SUCCESS,
  payload: category,
})

export const updateZoneFail = error => ({
  type: UPDATE_ZONE_FAIL,
  payload: error,
})

export const deleteZone = category => ({
  type: DELETE_ZONE,
  payload: category,
})

export const deleteZoneSuccess = category => ({
  type: DELETE_ZONE_SUCCESS,
  payload: category,
})

export const deleteZoneFail = error => ({
  type: DELETE_ZONE_FAIL,
  payload: error,
})
