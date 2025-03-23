import {
  SET_ALL_ORDERS_START_DATE,
  SET_ALL_ORDERS_END_DATE,
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

const INIT_STATE = {
  allOrdersStartDate: "",
  allOrdersEndDate: "",
  upcomingOrdersStartDate: () => {
    const start = new Date()
    return new Date(start.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  },
  upcomingOrdersEndDate: () => {
    const start = new Date()
    return new Date(start.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  },
  dueReturnOrdersStartDate: new Date().toISOString().split("T")[0],
  dueReturnOrdersEndDate: () => {
    const start = new Date(new Date().toISOString().split("T")[0])
    const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0] // 7 days in milliseconds
    return end
  },
  prebookingOrdersStartDate: "",
  prebookingOrdersEndDate: "",
  refundedOrdersStartDate: "",
  refundedOrdersEndDate: "",
  completedOrdersDate: new Date().toISOString().split("T")[0],
}

const OrderDates = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ALL_ORDERS_START_DATE:
      return {
        ...state,
        allOrdersStartDate: action.payload?.startDate,
      }
    case SET_ALL_ORDERS_END_DATE:
      return {
        ...state,
        allOrdersEndDate: action.payload?.endDate,
      }
    case SET_UPCOMING_ORDERS_START_DATE:
      return {
        ...state,
        upcomingOrdersStartDate: action.payload?.startDate,
      }
    case SET_UPCOMING_ORDERS_END_DATE:
      return {
        ...state,
        upcomingOrdersEndDate: action.payload?.endDate,
      }
    case SET_DUE_RETURN_ORDERS_START_DATE:
      return {
        ...state,
        dueReturnOrdersStartDate: action.payload?.startDate,
      }
    case SET_DUE_RETURN_ORDERS_END_DATE:
      return {
        ...state,
        dueReturnOrdersEndDate: action.payload?.endDate,
      }
    case SET_PREBOOKING_ORDERS_START_DATE:
      return {
        ...state,
        prebookingOrdersStartDate: action.payload?.startDate,
      }
    case SET_PREBOOKING_ORDERS_END_DATE:
      return {
        ...state,
        prebookingOrdersEndDate: action.payload?.endDate,
      }
    case SET_REFUNDED_ORDERS_START_DATE:
      return {
        ...state,
        refundedOrdersStartDate: action.payload?.startDate,
      }
    case SET_REFUNDED_ORDERS_END_DATE:
      return {
        ...state,
        refundedOrdersEndDate: action.payload?.endDate,
      }
    case SET_COMPLETED_ORDERS_DATE:
      return {
        ...state,
        completedOrdersDate: action.payload?.date,
      }
    default:
      return state
  }
}

export default OrderDates
