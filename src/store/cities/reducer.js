import {
  GET_CITIES_FAIL,
  GET_CITIES_SUCCESS,
  ADD_CITY_SUCCESS,
  ADD_CITY_FAIL,
  UPDATE_CITY_SUCCESS,
  UPDATE_CITY_FAIL,
  DELETE_CITY_SUCCESS,
  DELETE_CITY_FAIL
} from "./actionTypes";

const INIT_STATE = {
  cities: [],
  toy: {},
  error: {},
  loading: true
};

const City = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        cities: action.payload,
        loading: true
      };

    case GET_CITIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CITY_SUCCESS:
      return {
        ...state,
        cities: [...state.cities, action.payload],
      };

    case ADD_CITY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CITY_SUCCESS:
      return {
        ...state,
        cities: state.cities.map(category =>
          (category._id + '') === (action.payload._id + '')
            ? { category, ...action.payload }
            : category
        ),
      };

    case UPDATE_CITY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CITY_SUCCESS:
      return {
        ...state,
        cities: state.cities.filter(
          category => category._id !== action?.payload?._id
        ),
      };

    case DELETE_CITY_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default City;
