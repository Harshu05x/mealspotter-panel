import {
  CHANGE_ORDER_STATUS_FAIL,
  CHANGE_ORDER_STATUS_SUCCESS,
  GET_DUE_RETURN_FAIL,
  GET_DUE_RETURN_SUCCESS,
  GET_ONGOING_FAIL,
  GET_ONGOING_SUCCESS,
  GET_PREBOOKING_FAIL,
  GET_PREBOOKING_SUCCESS,
  GET_UPCOMING_FAIL,
  GET_UPCOMING_SUCCESS,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAIL,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAIL,
  GET_CANCELLED_ORDERS_SUCCESS,
  GET_CANCELLED_ORDERS_FAIL,
  GET_COMPLETED_ORDERS_SUCCESS,
  GET_COMPLETED_ORDERS_FAIL,
  GET_REFUNDED_ORDERS_SUCCESS,
  GET_REFUNDED_ORDERS_FAIL
} from "./actionTypes";

const INIT_STATE = {
  upcomingOrders: [],
  ongoingOrders: [],
  duereturnOrders: [],
  preBookings: [],
  allOrders: [],
  cancelledOrders: [],
  refundedOrders: [],
  completedOrders: [],
  totalOrders: 0,
  toy: {},
  error: {},
  loading: true
};

const Order = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        allOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_ALL_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };

    case GET_UPCOMING_SUCCESS:
      return {
        ...state,
        upcomingOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_UPCOMING_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false 
      };
    
    case GET_ONGOING_SUCCESS:
      return {
        ...state,
        ongoingOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };
    
    case GET_ONGOING_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };

    case GET_DUE_RETURN_SUCCESS:
      return {
        ...state,
        duereturnOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_DUE_RETURN_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };
    case GET_PREBOOKING_SUCCESS:
      return {
        ...state,
        preBookings: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };
    case GET_PREBOOKING_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };
    
    case CHANGE_ORDER_STATUS_SUCCESS: 
      return {
        ...state,
        loading: true
      };
    
    case CHANGE_ORDER_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: true
      };

    case CANCEL_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case GET_CANCELLED_ORDERS_SUCCESS:
      return {
        ...state,
        cancelledOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_CANCELLED_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };

    case GET_COMPLETED_ORDERS_SUCCESS:
      return {
        ...state,
        completedOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_COMPLETED_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };

    case GET_REFUNDED_ORDERS_SUCCESS:
      return {
        ...state,
        refundedOrders: action.payload?.orders,
        totalOrders: action.payload?.totalOrders,
        loading: true
      };

    case GET_REFUNDED_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload?.orders,
        totalOrders: 0,
        loading: false
      };
    
    default:
      return { ...state };
  }
};

export default Order;
