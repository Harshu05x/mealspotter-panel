import {
  GET_PICKUP_POINTS,
  GET_PICKUP_POINTS_SUCCESS,
  GET_PICKUP_POINTS_FAIL,
  ADD_PICKUP_POINT,
  ADD_PICKUP_POINT_SUCCESS,
  ADD_PICKUP_POINT_FAIL,
  UPDATE_PICKUP_POINT,
  UPDATE_PICKUP_POINT_SUCCESS,
  UPDATE_PICKUP_POINT_FAIL,
  DELETE_PICKUP_POINT,
  DELETE_PICKUP_POINT_SUCCESS,
  DELETE_PICKUP_POINT_FAIL,
} from './actionTypes'

export const getPickUpPoints = () => ({
  type: GET_PICKUP_POINTS,
})

export const getPickUpPointsSuccess = pickUpPoints => ({
  type: GET_PICKUP_POINTS_SUCCESS,
  payload: pickUpPoints,
})

export const getPickUpPointsFail = error => ({
  type: GET_PICKUP_POINTS_FAIL,
  payload: error,
})

export const addNewPickUpPoint = pickUpPoint => ({
  type: ADD_PICKUP_POINT,
  payload: pickUpPoint,
})

export const addPickUpPointSuccess = pickUpPoint => ({
  type: ADD_PICKUP_POINT_SUCCESS,
  payload: pickUpPoint,
})

export const addPickUpPointFail = error => ({
  type: ADD_PICKUP_POINT_FAIL,
  payload: error,
})

export const updatePickUpPoint = pickUpPoint => ({
  type: UPDATE_PICKUP_POINT,
  payload: pickUpPoint,
})

export const updatePickUpPointSuccess = pickUpPoint => ({
  type: UPDATE_PICKUP_POINT_SUCCESS,
  payload: pickUpPoint,
})

export const updatePickUpPointFail = error => ({
  type: UPDATE_PICKUP_POINT_FAIL,
  payload: error,
})

export const deletePickUpPoint = pickUpPoint => ({
  type: DELETE_PICKUP_POINT,
  payload: pickUpPoint,
})

export const deletePickUpPointSuccess = pickUpPoint => ({
  type: DELETE_PICKUP_POINT_SUCCESS,
  payload: pickUpPoint,
})

export const deletePickUpPointFail = error => ({
  type: DELETE_PICKUP_POINT_FAIL,
  payload: error,
})


