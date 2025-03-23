import {
  GET_AREAS_FAIL,
  GET_AREAS_SUCCESS,
  ADD_AREA_SUCCESS,
  ADD_AREA_FAIL,
  UPDATE_AREA_SUCCESS,
  UPDATE_AREA_FAIL,
  DELETE_AREA_SUCCESS,
  DELETE_AREA_FAIL
} from "./actionTypes";

const INIT_STATE = {
  areas: [],
  toy: {},
  error: {},
  loading: true
};

const Area = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_AREAS_SUCCESS:
      return {
        ...state,
        areas: action.payload,
        loading: true
      };

    case GET_AREAS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_AREA_SUCCESS:
      return {
        ...state,
        areas: [...state.areas, action.payload],
      };

    case ADD_AREA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_AREA_SUCCESS:
      return {
        ...state,
        areas: state.areas.map(area =>
          (area._id + '') === (action.payload._id + '')
            ? { area, ...action.payload }
            : area
        ),
      };

    case UPDATE_AREA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_AREA_SUCCESS:
      return {
        ...state,
        areas: state.areas.filter(
          area => area._id !== action?.payload?._id
        ),
      };

    case DELETE_AREA_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default Area;
