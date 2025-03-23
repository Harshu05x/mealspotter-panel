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

export const setAllOrderStartDate = date => ({
  type: SET_ALL_ORDERS_START_DATE,
  payload: {
    startDate: date
  }
})

export const setAllOrdersEndDate = date => ({
  type: SET_ALL_ORDERS_END_DATE,
  payload: {
    endDate: date
  }
})

export const setUpcomingOrdersStartDate = date => ({
  type: SET_UPCOMING_ORDERS_START_DATE,
  payload: {
    startDate: date
  }
})

export const setUpcomingOrdersEndDate = date => ({
  type: SET_UPCOMING_ORDERS_END_DATE,
  payload: {
    endDate: date
  }
})

export const setDueReturnOrdersStartDate = date => ({
  type: SET_DUE_RETURN_ORDERS_START_DATE,
  payload: {
    startDate: date
  }
})

export const setDueReturnOrdersEndDate = date => ({
  type: SET_DUE_RETURN_ORDERS_END_DATE,
  payload: {
    endDate: date
  }
})

export const setPrebookingOrdersStartDate = date => ({
  type: SET_PREBOOKING_ORDERS_START_DATE,
  payload: {
    startDate: date
  }
})

export const setPrebookingOrdersEndDate = date => ({
  type: SET_PREBOOKING_ORDERS_END_DATE,
  payload: {
    endDate: date
  }
})

export const setRefundedOrdersStartDate = date => ({
  type: SET_REFUNDED_ORDERS_START_DATE,
  payload: {
    startDate: date
  }
})

export const setRefundedOrdersEndDate = date => ({
  type: SET_REFUNDED_ORDERS_END_DATE,
  payload: {
    endDate: date
  }
})

export const setCompletedOrdersDate = date => ({
  type: SET_COMPLETED_ORDERS_DATE,
  payload: {
    date
  }
})
