import { put, takeEvery } from "redux-saga/effects"

const { apiFail } = require("store/actions")

import {
  SET_ALL_ORDERS_END_DATE,
  SET_ALL_ORDERS_START_DATE,
  SET_UPCOMING_ORDERS_START_DATE,
  SET_UPCOMING_ORDERS_END_DATE,
  SET_DUE_RETURN_ORDERS_START_DATE,
  SET_DUE_RETURN_ORDERS_END_DATE,
  SET_PREBOOKING_ORDERS_END_DATE,
  SET_PREBOOKING_ORDERS_START_DATE,
  SET_REFUNDED_ORDERS_END_DATE,
  SET_REFUNDED_ORDERS_START_DATE,
  SET_COMPLETED_ORDERS_DATE,
} from "./actionTypes"


function* setAllOrderStartDates({ payload: { startDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setAllOrderEndDates({ payload: { endDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setDueReturnOrderStartDates({ payload: { startDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setDueReturnOrderEndDates({ payload: { endDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setPrebookingOrderStartDates({ payload: { startDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setPrebookingOrderEndDates({ payload: { endDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setRefundedOrderStartDates({ payload: { startDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setRefundedOrderEndDates({ payload: { endDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setCompletedOrderDates({ payload: { date } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setUpcomingOrderStartDates({ payload: { startDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}

function* setUpcomingOrderEndDates({ payload: { endDate } }) {
  try {
  } catch (error) {
    yield put(apiFail(error))
  }
}



function* DatesSaga() {
  yield takeEvery(SET_ALL_ORDERS_START_DATE, setAllOrderStartDates);
  yield takeEvery(SET_ALL_ORDERS_END_DATE, setAllOrderEndDates);
  yield takeEvery(SET_UPCOMING_ORDERS_START_DATE, setUpcomingOrderStartDates);
  yield takeEvery(SET_UPCOMING_ORDERS_END_DATE, setUpcomingOrderEndDates);
  yield takeEvery(SET_DUE_RETURN_ORDERS_START_DATE, setDueReturnOrderStartDates);
  yield takeEvery(SET_DUE_RETURN_ORDERS_END_DATE, setDueReturnOrderEndDates);
  yield takeEvery(SET_PREBOOKING_ORDERS_START_DATE, setPrebookingOrderStartDates);
  yield takeEvery(SET_PREBOOKING_ORDERS_END_DATE, setPrebookingOrderEndDates);
  yield takeEvery(SET_REFUNDED_ORDERS_START_DATE, setRefundedOrderStartDates);
  yield takeEvery(SET_REFUNDED_ORDERS_END_DATE, setRefundedOrderEndDates);
  yield takeEvery(SET_COMPLETED_ORDERS_DATE, setCompletedOrderDates);
}

export default DatesSaga;
