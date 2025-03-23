import {
  GET_TOYS_FAIL,
  GET_TOYS_SUCCESS,
  ADD_TOY_SUCCESS,
  ADD_TOY_FAIL,
  UPDATE_TOY_SUCCESS,
  UPDATE_TOY_FAIL,
  DELETE_TOY_SUCCESS,
  DELETE_TOY_FAIL,
  UPDATE_TOY_AVAILABILITY,
  SET_LOADING
} from "./actionTypes";

import {
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
} from "../categories/actionTypes";

const INIT_STATE = {
  toys: [],
  totalPages: 0,
  toy: {},
  error: {},
  loading: true,
  addedToy: null,
  api: false
};

const Toys = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_TOYS_SUCCESS:
      return {
        ...state,
        toys: action.payload?.toys || [],
        totalPages: action.payload?.totalToys || 0,
        loading: false
      };

    case GET_TOYS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TOY_SUCCESS:
      return {
        ...state,
        toys: [...state.toys, action.payload],
        addedToy: action.payload,
        loading: false
      };

    case ADD_TOY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case UPDATE_TOY_SUCCESS:
      return {
        ...state,
        toys: state.toys.map(toy =>
          (toy._id + '') === (action.payload._id + '')
            ? { toy, ...action.payload }
            : toy
        ),
        loading: false
      };

    case UPDATE_TOY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case DELETE_TOY_SUCCESS:
      return {
        ...state,
        toys: state.toys.filter(
          toy => toy?._id?.toString() !== action.payload
        ),
      };

    case DELETE_TOY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TOY_AVAILABILITY:
      return {
        ...state,
        toys: state.toys.map((toy) =>
          toy._id === action.payload.toyId
            ? { ...toy, isAvailable: action.payload.isAvailable }
            : toy
        ),
      };

    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    case GET_CATEGORIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload || false,
      };

    default:
      return state;
  }
};

export default Toys;
