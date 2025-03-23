import {
  GET_ZONES_FAIL,
  GET_ZONES_SUCCESS,
  ADD_ZONE_SUCCESS,
  ADD_ZONE_FAIL,
  UPDATE_ZONE_SUCCESS,
  UPDATE_ZONE_FAIL,
  DELETE_ZONE_SUCCESS,
  DELETE_ZONE_FAIL
} from "./actionTypes";

const INIT_STATE = {
  zones: [],
  toy: {},
  error: {},
  loading: true
};

const Zone = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_ZONES_SUCCESS:
      return {
        ...state,
        zones: action.payload,
        loading: true
      };

    case GET_ZONES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ZONE_SUCCESS:
      return {
        ...state,
        zones: [...state.zones, action.payload],
      };

    case ADD_ZONE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ZONE_SUCCESS:
      return {
        ...state,
        zones: state.zones.map(zone =>
          (zone._id + '') === (action.payload._id + '')
            ? { zone, ...action.payload }
            : zone
        ),
      };

    case UPDATE_ZONE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ZONE_SUCCESS:
      return {
        ...state,
        zones: state.zones.filter(
          zone => zone._id !== action?.payload?._id
        ),
      };

    case DELETE_ZONE_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default Zone;
