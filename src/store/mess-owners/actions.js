import {
  GET_MESS_OWNERS,
  GET_MESS_OWNERS_FAIL,
  GET_MESS_OWNERS_SUCCESS,
  ADD_NEW_MESS_OWNER,
  ADD_MESS_OWNER_SUCCESS,
  ADD_MESS_OWNER_FAIL,
  UPDATE_MESS_OWNER,
  UPDATE_MESS_OWNER_SUCCESS,
  UPDATE_MESS_OWNER_FAIL,
  DELETE_MESS_OWNER,
  DELETE_MESS_OWNER_SUCCESS,
  DELETE_MESS_OWNER_FAIL
} from "./actionTypes"

export const getMessOwners = (filter) => ({
  type: GET_MESS_OWNERS,
  payload: filter,
})

export const getMessOwnersSuccess = messOwners => ({
  type: GET_MESS_OWNERS_SUCCESS,
  payload: messOwners,
})

export const getMessOwnersFail = error => ({
  type: GET_MESS_OWNERS_FAIL,
  payload: error,
})

export const addNewMessOwner = category => ({
  type: ADD_NEW_MESS_OWNER,
  payload: category,
})

export const addMessOwnerSuccess = category => ({
  type: ADD_MESS_OWNER_SUCCESS,
  payload: category,
})

export const addMessOwnerFail = error => ({
  type: ADD_MESS_OWNER_FAIL,
  payload: error,
})

export const updateMessOwner = category => ({
  type: UPDATE_MESS_OWNER,
  payload: category,
})

export const updateMessOwnerSuccess = category => ({
  type: UPDATE_MESS_OWNER_SUCCESS,
  payload: category,
})

export const updateMessOwnerFail = error => ({
  type: UPDATE_MESS_OWNER_FAIL,
  payload: error,
})

export const deleteMessOwner = category => ({
  type: DELETE_MESS_OWNER,
  payload: category,
})

export const deleteMessOwnerSuccess = category => ({
  type: DELETE_MESS_OWNER_SUCCESS,
  payload: category,
})

export const deleteMessOwnerFail = error => ({
  type: DELETE_MESS_OWNER_FAIL,
  payload: error,
})
