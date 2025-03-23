import { SYSTEM_LOADING, SYSTEM_ERROR } from "./actionTypes";

const INIT_STATE = {
  error: false,
  loading : true
}

const systemState = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SYSTEM_LOADING:
      return {
        ...state,
        loading: action.payload || false,
      }

    case SYSTEM_ERROR:
      return {
        ...state,
        error: action.payload || false,
      }

    default:
      return state
  }
}

export default systemState;
