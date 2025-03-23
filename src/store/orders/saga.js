import { call, put, takeEvery } from "redux-saga/effects";

// Customer Redux States
import {
  CHANGE_ORDER_STATUS,
  GET_DUE_RETURN_ORDERS,
  GET_ONGOING_ORDERS,
  GET_PREBOOKING_ORDERS,
  GET_UPCOMING_ORDERS,
  GET_ALL_ORDERS,
  CANCEL_ORDER,
  GET_CANCELLED_ORDERS,
  GET_COMPLETED_ORDERS,
  GET_REFUNDED_ORDERS
} from "./actionTypes";
import {
  changeOrderStatusFail,
  changeOrderStatusSuccess,
  getDueReturnFail,
  getDueReturnSuccess,
  getOngoingFail,
  getOngoingSuccess,
  getPreBookingFail,
  getPreBookingSuccess,
  getUpcomingFail,
  getUpcomingSuccess,
  getAllOrdersFail,
  getAllOrdersSuccess,
  cancelOrderSuccess,
  cancelOrderFail,
  getCancelledOrdersSuccess,
  getCancelledOrdersFail,
  getCompletedOrdersSuccess,
  getCompletedOrdersFail,
  getRefundedOrdersSuccess,
  getRefundedOrdersFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  changeOrderStatus,
  getDueReturns,
  getOngoingOrders,
  getPreBookings,
  getUpcomingOrders,
  getAllOrdersAPI,
  cancelOrder,
  getCancelledOrdersAPI,
  getCompletedOrdersAPI,
  getRefundedOrdersAPI
} from "helpers/order_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchAllOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getAllOrdersAPI, page, limit, startDate, endDate, query);
    yield put(getAllOrdersSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getAllOrdersFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* fetchUpcomingOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getUpcomingOrders, page, limit, startDate, endDate, query);
    yield put(getUpcomingSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getUpcomingFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* fetchOngoingOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getOngoingOrders,page,limit,startDate, endDate, query);
    yield put(getOngoingSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getOngoingFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* fetchDuereturnOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getDueReturns,page,limit,startDate, endDate, query);
    yield put(getDueReturnSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getDueReturnFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* fetchPreBookings({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getPreBookings,page,limit,startDate, endDate, query);
    yield put(getPreBookingSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getPreBookingFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* onChangeOrderStatus({ payload: { orderIds, status } }) {
  try {
    const response = yield call(changeOrderStatus, {orderIds, status});
    yield put(changeOrderStatusSuccess(response));
    toast.success("Order Status Changed Successfully");
  } catch (error) {
    yield put(changeOrderStatusFail(error));
  }
}

function* onCancelOrder({ payload: { orderId, reason } }) {
  try {
    const response = yield call(cancelOrder, orderId, reason);
    yield put(cancelOrderSuccess(response));
    toast.success("Order Cancelled Successfully");
  } catch (error) {
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    toast.error(errorMessage);
    yield put(cancelOrderFail(error));
  }
}

function* fetchCancelledOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    const response = yield call(getCancelledOrdersAPI, page, limit, startDate, endDate, query);
    yield put(getCancelledOrdersSuccess(response));
  } catch (error) {
    yield put(getCancelledOrdersFail(error));
  }
}

function* fetchCompletedOrders({ payload: {page, limit, date, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getCompletedOrdersAPI, page, limit, date, query);
    yield put(getCompletedOrdersSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getCompletedOrdersFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* fetchRefundedOrders({ payload: {page, limit, startDate, endDate, query} }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getRefundedOrdersAPI, page, limit, startDate, endDate, query);
    yield put(getRefundedOrdersSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getRefundedOrdersFail(error));
     let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
    yield put(setSystemError(errorMessage));
  }
}

function* OrderSaga() {
  yield takeEvery(GET_ALL_ORDERS, fetchAllOrders);
  yield takeEvery(GET_UPCOMING_ORDERS, fetchUpcomingOrders);
  yield takeEvery(GET_ONGOING_ORDERS, fetchOngoingOrders);
  yield takeEvery(GET_DUE_RETURN_ORDERS, fetchDuereturnOrders);
  yield takeEvery(GET_PREBOOKING_ORDERS, fetchPreBookings);
  yield takeEvery(CHANGE_ORDER_STATUS, onChangeOrderStatus);
  yield takeEvery(CANCEL_ORDER, onCancelOrder);
  yield takeEvery(GET_CANCELLED_ORDERS, fetchCancelledOrders);
  yield takeEvery(GET_COMPLETED_ORDERS, fetchCompletedOrders);
  yield takeEvery(GET_REFUNDED_ORDERS, fetchRefundedOrders);
}

export default OrderSaga;