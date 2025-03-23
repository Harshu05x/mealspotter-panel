import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        isUserLogout: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state , isUserLogout: true}
      break
    case API_ERROR:
      let _error = "";
      if(action.payload && action.payload.response && action.payload.response && action.payload.response.data ){
        _error = action.payload.response.data.msg;
      }
      else{
        _error = "Error occured"; 
      }
      state = { ...state, error: _error, loading: false,isUserLogout: false, }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
