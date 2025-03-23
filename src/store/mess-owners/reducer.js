import {
  GET_MESS_OWNERS_FAIL,
  GET_MESS_OWNERS_SUCCESS,
  ADD_MESS_OWNER_SUCCESS,
  ADD_MESS_OWNER_FAIL,
  UPDATE_MESS_OWNER_SUCCESS,
  UPDATE_MESS_OWNER_FAIL,
  DELETE_MESS_OWNER_SUCCESS,
  DELETE_MESS_OWNER_FAIL
} from "./actionTypes";

const INIT_STATE = {
  messOwners: [],
  messOwner: {},
  error: {},
  loading: true
};

const City = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_MESS_OWNERS_SUCCESS:
      return {
        ...state,
        messOwners: action.payload,
        loading: true
      };

    case GET_MESS_OWNERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_MESS_OWNER_SUCCESS:
      return {
        ...state,
        messOwners: [action.payload, ...state.messOwners],
      };

    case ADD_MESS_OWNER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_MESS_OWNER_SUCCESS:
      return {
        ...state,
        messOwners: state.messOwners.map(messOwner =>
          (messOwner._id + '') === (action.payload._id + '')
            ? { messOwner, ...action.payload }
            : messOwner
        ),
      };

    case UPDATE_MESS_OWNER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_MESS_OWNER_SUCCESS:
      return {
        ...state,
        messOwners: state.messOwners.filter(
          messOwner => messOwner._id !== action?.payload?._id
        ),
      };

    case DELETE_MESS_OWNER_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default City;
