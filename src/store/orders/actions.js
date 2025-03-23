// redux/orders/actions.js
import {
  GET_UPCOMING_ORDERS,
  GET_UPCOMING_SUCCESS,
  GET_UPCOMING_FAIL,
  GET_UPCOMING_ORDERS_FOR_CUSTOMER,
  GET_ONGOING_ORDERS,
  GET_ONGOING_SUCCESS,
  GET_ONGOING_FAIL,
  GET_DUE_RETURN_ORDERS,
  GET_DUE_RETURN_SUCCESS,
  GET_DUE_RETURN_FAIL,
  GET_PREBOOKING_ORDERS,
  GET_PREBOOKING_SUCCESS,
  GET_PREBOOKING_FAIL,
  CHANGE_ORDER_STATUS,
  CHANGE_ORDER_STATUS_SUCCESS,
  CHANGE_ORDER_STATUS_FAIL,
  GET_ALL_ORDERS,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAIL,
  CANCEL_ORDER,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAIL,
  GET_CANCELLED_ORDERS,
  GET_CANCELLED_ORDERS_SUCCESS,
  GET_CANCELLED_ORDERS_FAIL,
  GET_COMPLETED_ORDERS,
  GET_COMPLETED_ORDERS_SUCCESS,
  GET_COMPLETED_ORDERS_FAIL,
  GET_REFUNDED_ORDERS,
  GET_REFUNDED_ORDERS_SUCCESS,
  GET_REFUNDED_ORDERS_FAIL
} from "./actionTypes"

export const getAllOrders = (page, limit, startDate, endDate, query) => ({
  type: GET_ALL_ORDERS,
  payload: { page, limit, startDate, endDate, query },
});

export const getAllOrdersSuccess = orders => ({
  type: GET_ALL_ORDERS_SUCCESS,
  payload: orders,
});

export const getAllOrdersFail = error => ({
  type: GET_ALL_ORDERS_FAIL,
  payload: error,
});

export const getUpcomingOrders = (page,limit, startDate, endDate, query) => ({
  type: GET_UPCOMING_ORDERS,
  payload: {page, limit, startDate, endDate, query},
})

export const getUpcomingSuccess = orders => ({
  type: GET_UPCOMING_SUCCESS,
  payload: orders,
})

export const getUpcomingFail = error => ({
  type: GET_UPCOMING_FAIL,
  payload: error,
})

export const getOngoingOrders = (page,limit, startDate,endDate, query) => ({
  type: GET_ONGOING_ORDERS,
  payload: {page,limit, startDate,endDate, query},
})

export const getOngoingSuccess = orders => ({
  type: GET_ONGOING_SUCCESS,
  payload: orders,
})

export const getOngoingFail = error => ({
  type: GET_ONGOING_FAIL,
  payload: error,
})

export const getDueReturns = (page,limit, startDate,endDate, query) => ({
  type: GET_DUE_RETURN_ORDERS,
  payload: {page,limit, startDate,endDate, query},
})

export const getDueReturnSuccess = orders => ({
  type: GET_DUE_RETURN_SUCCESS,
  payload: orders,
})

export const getDueReturnFail = error => ({ 
  type: GET_DUE_RETURN_FAIL,
  payload: error,
})

export const getProBookings = (page,limit, startDate,endDate, query) => ({
  type: GET_PREBOOKING_ORDERS,
  payload: {page,limit, startDate,endDate, query},
});

export const getPreBookingSuccess = orders => ({
  type: GET_PREBOOKING_SUCCESS,
  payload: orders,
});

export const getPreBookingFail = error => ({
  type: GET_PREBOOKING_FAIL,
  payload: error,
});

export const changeOrderStatus = (orderIds, status) => ({
  type: CHANGE_ORDER_STATUS,
  payload: { orderIds, status },
});

export const changeOrderStatusSuccess = () => ({
  type: CHANGE_ORDER_STATUS_SUCCESS,
});

export const changeOrderStatusFail = error => ({
  type: CHANGE_ORDER_STATUS_FAIL,
  payload: error,
});

export const cancelOrder = (orderId, reason) => ({
  type: CANCEL_ORDER,
  payload: { orderId, reason },
});

export const cancelOrderSuccess = () => ({
  type: CANCEL_ORDER_SUCCESS,
});

export const cancelOrderFail = error => ({
  type: CANCEL_ORDER_FAIL,
  payload: error,
});

export const getCancelledOrders = (page,limit, startDate, endDate, query) => ({
  type: GET_CANCELLED_ORDERS,
  payload: { page,limit, startDate, endDate, query },
});

export const getCancelledOrdersSuccess = orders => ({
  type: GET_CANCELLED_ORDERS_SUCCESS,
  payload: orders,
});

export const getCancelledOrdersFail = error => ({
  type: GET_CANCELLED_ORDERS_FAIL,
  payload: error,
});

export const getCompletedOrders = (page,limit, date, query) => ({
  type: GET_COMPLETED_ORDERS,
  payload: { page,limit, date, query },
});

export const getCompletedOrdersSuccess = orders => ({
  type: GET_COMPLETED_ORDERS_SUCCESS,
  payload: orders,
});

export const getCompletedOrdersFail = error => ({
  type: GET_COMPLETED_ORDERS_FAIL,
  payload: error,
});

export const getRefundedOrders = (page,limit, startDate, endDate, query) => ({
  type: GET_REFUNDED_ORDERS,
  payload: { page,limit, startDate, endDate, query },
});

export const getRefundedOrdersSuccess = orders => ({
  type: GET_REFUNDED_ORDERS_SUCCESS,
  payload: orders,
});

export const getRefundedOrdersFail = error => ({
  type: GET_REFUNDED_ORDERS_FAIL,
  payload: error,
});