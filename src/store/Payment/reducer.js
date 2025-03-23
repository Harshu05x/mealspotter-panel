import {
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAIL
} from "./actionTypes";

const INIT_STATE = {
  payments: [],
  totalRecords: 0,
  loading: true
};

const Payment = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_PAYMENT_HISTORY_SUCCESS:
      return {
        ...state,
        payments: action.payload?.payments,
        totalRecords: action.payload?.totalRecords,
        loading: true
      };
    
    case GET_PAYMENT_HISTORY_FAIL:
      return {
        ...state,
        error: action.payload?.payments,
        totalRecords: 0,
        loading: false
      };

    default:
      return state;
  }
};

export default Payment;
