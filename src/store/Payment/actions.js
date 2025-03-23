import {
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAIL
} from "./actionTypes"

export const getPaymentHistory = (page,limit,startDate,endDate, query) => ({
  type: GET_PAYMENT_HISTORY,
  payload: {page,limit,startDate,endDate, query},
})

export const getPaymentHistorySuccess = orders => ({
  type: GET_PAYMENT_HISTORY_SUCCESS,
  payload: orders,
})

export const getPaymentHistoryFail = error => ({
  type: GET_PAYMENT_HISTORY_FAIL,
  payload: error,
})
