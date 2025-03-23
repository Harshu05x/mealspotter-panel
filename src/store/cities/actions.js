import {
  GET_CITIES,
  GET_CITIES_FAIL,
  GET_CITIES_SUCCESS,
  ADD_NEW_CITY,
  ADD_CITY_SUCCESS,
  ADD_CITY_FAIL,
  UPDATE_CITY,
  UPDATE_CITY_SUCCESS,
  UPDATE_CITY_FAIL,
  DELETE_CITY,
  DELETE_CITY_SUCCESS,
  DELETE_CITY_FAIL
} from "./actionTypes"

export const getCities = (filter) => ({
  type: GET_CITIES,
  payload: filter,
})

export const getCitiesSuccess = cities => ({
  type: GET_CITIES_SUCCESS,
  payload: cities,
})

export const getCitiesFail = error => ({
  type: GET_CITIES_FAIL,
  payload: error,
})

export const addNewCity = category => ({
  type: ADD_NEW_CITY,
  payload: category,
})

export const addCitySuccess = category => ({
  type: ADD_CITY_SUCCESS,
  payload: category,
})

export const addCityFail = error => ({
  type: ADD_CITY_FAIL,
  payload: error,
})

export const updateCity = category => ({
  type: UPDATE_CITY,
  payload: category,
})

export const updateCitySuccess = category => ({
  type: UPDATE_CITY_SUCCESS,
  payload: category,
})

export const updateCityFail = error => ({
  type: UPDATE_CITY_FAIL,
  payload: error,
})

export const deleteCity = category => ({
  type: DELETE_CITY,
  payload: category,
})

export const deleteCitySuccess = category => ({
  type: DELETE_CITY_SUCCESS,
  payload: category,
})

export const deleteCityFail = error => ({
  type: DELETE_CITY_FAIL,
  payload: error,
})
