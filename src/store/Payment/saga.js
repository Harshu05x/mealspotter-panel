import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_PAYMENT_HISTORY
} from "./actionTypes";
import {
  getPaymentHistorySuccess,
  getPaymentHistoryFail
} from "./actions";

import {
  getPaymentHistory
} from "helpers/payment_helper"
import { setSystemError, setSystemLoading } from "store/actions";


function* getPaymentHistoryFunc({ payload: { page, limit,startDate, endDate, query } }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getPaymentHistory, page,limit, startDate, endDate, query);
    yield put(getPaymentHistorySuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getPaymentHistoryFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* categorySaga() {
  yield takeEvery(GET_PAYMENT_HISTORY, getPaymentHistoryFunc);
}

export default categorySaga;
