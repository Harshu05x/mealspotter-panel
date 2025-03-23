import {
  GET_TOYS,
  GET_TOYS_FAIL,
  GET_TOYS_SUCCESS,
  ADD_NEW_TOY,
  ADD_TOY_SUCCESS,
  ADD_TOY_FAIL,
  UPDATE_TOY,
  UPDATE_TOY_SUCCESS,
  UPDATE_TOY_FAIL,
  DELETE_TOY,
  DELETE_TOY_SUCCESS,
  DELETE_TOY_FAIL,
  UPDATE_TOY_AVAILABILITY,
  UPDATE_TOY_AVAILABILITY_SUCCESS,
  UPDATE_TOY_AVAILABILITY_FAIL,
  SET_LOADING
} from "./actionTypes"

export const getToys = (page, limit, query, status, category, type) => ({
  type: GET_TOYS,
  payload: { page, limit, query, status, category, type },
})

export const getToysSuccess = toys => ({
  type: GET_TOYS_SUCCESS,
  payload: toys,
})

export const getToysFail = error => ({
  type: GET_TOYS_FAIL,
  payload: error,
})

export const addNewToy = toy => ({
  type: ADD_NEW_TOY,
  payload: toy,
})

export const addToySuccess = toy => ({
  type: ADD_TOY_SUCCESS,
  payload: toy,
})

export const addToyFail = error => ({
  type: ADD_TOY_FAIL,
  payload: error,
})

export const updateToy = toy => ({
  type: UPDATE_TOY,
  payload: toy,
})

export const updateToySuccess = toy => ({
  type: UPDATE_TOY_SUCCESS,
  payload: toy,
})

export const updateToyFail = error => ({
  type: UPDATE_TOY_FAIL,
  payload: error,
})

export const deleteToy = toy => ({
  type: DELETE_TOY,
  payload: toy,
})

export const deleteToySuccess = toy => ({
  type: DELETE_TOY_SUCCESS,
  payload: toy,
})

export const deleteToyFail = error => ({
  type: DELETE_TOY_FAIL,
  payload: error,
})

export const updateToyAvailability = (toyId, isAvailable) => ({
  type: UPDATE_TOY_AVAILABILITY,
  payload: { toyId, isAvailable },
});

export const updateToyAvailabilitySuccess = (toyId, isAvailable) => ({
  type: UPDATE_TOY_AVAILABILITY_SUCCESS,
  payload: { toyId, isAvailable },
});

export const updateToyAvailabilityFail = (error) => ({
  type: UPDATE_TOY_AVAILABILITY_FAIL,
  payload: error,
});

export const setLoading = (value) => ({
  type: SET_LOADING,
  payload: value,
});