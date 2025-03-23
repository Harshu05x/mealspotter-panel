import {
  GET_PICKUP_POINTS_SUCCESS,
  GET_PICKUP_POINTS_FAIL,
  ADD_PICKUP_POINT_SUCCESS,
  ADD_PICKUP_POINT_FAIL,
  UPDATE_PICKUP_POINT_SUCCESS,
  UPDATE_PICKUP_POINT_FAIL,
  DELETE_PICKUP_POINT_SUCCESS,
  DELETE_PICKUP_POINT_FAIL,
} from './actionTypes';


const INIT_STATE = {
  pickUpPoints: [],
  error: {},
  loading: true
};

const PickUpPoint = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PICKUP_POINTS_SUCCESS:
      return {
        ...state,
        pickUpPoints: action.payload,
        loading: false,
      };
    
    case GET_PICKUP_POINTS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case ADD_PICKUP_POINT_SUCCESS:
      return {
        ...state,
        pickUpPoints: [...state.pickUpPoints, action.payload],
      };
    
    case ADD_PICKUP_POINT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PICKUP_POINT_SUCCESS:
      return {
        ...state,
        pickUpPoints: state.pickUpPoints.map(pickUpPoint =>
          (pickUpPoint._id + '') === (action.payload._id + '')
            ? { pickUpPoint, ...action.payload }
            : pickUpPoint
        ),
      };
    
    case UPDATE_PICKUP_POINT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case DELETE_PICKUP_POINT_SUCCESS:
      return {
        ...state,
        pickUpPoints: state.pickUpPoints.filter(
          pickUpPoint => pickUpPoint._id !== action?.payload?._id
        ),
      };
    
    case DELETE_PICKUP_POINT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export default PickUpPoint;
