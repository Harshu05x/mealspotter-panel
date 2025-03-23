import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, GET_USER_PROFILE, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_ERROR, UPDATE_USER_PASSWORD } from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  user: {},
  loading: true,
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case PROFILE_SUCCESS:
      state = { ...state, success: action.payload };
      break;
    case PROFILE_ERROR:
      state = { ...state, error: action.payload };
      break;
    case RESET_PROFILE_FLAG:
      state = { ...state, success: null };
      break;
    case GET_USER_PROFILE:
      state = { ...state };
      break;
    case GET_USER_PROFILE_SUCCESS:
      state = { ...state, user: action.payload, loading: false};
      break;
    case GET_USER_PROFILE_ERROR:
      state = { ...state, error: action.payload, loading: false};
      break;
    case UPDATE_USER_PASSWORD:
      state = { ...state };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
