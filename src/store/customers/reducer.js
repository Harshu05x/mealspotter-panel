import {
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  ON_UPDATE_CUSTOMER_SUCCESS,
  ON_UPDATE_CUSTOMER_FAIL,
  ON_DELETE_CUSTOMER_SUCCESS,
  ON_DELETE_CUSTOMER_FAIL,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GET_CUSTOMER_DETAILS_FAIL,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDERS_SUCCESS,
  GET_CUSTOMER_ORDERS_FAIL,
  GET_CUSTOMER_ENQUIRIES_SUCCESS,
  GET_CUSTOMER_ENQUIRIES_FAIL,
  GET_ALL_CUSTOMERS,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAIL
} from "./actionTypes";

const INIT_STATE = {
  customers: [],
  customer: {},
  allCustomers: [],
  totalCustomers: 0,
  toy: {},
  error: {},
  loading: true,
  enquiries: [],
  totalEnquiries: 0,
};

const Customer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload?.customers || [],
        totalCustomers: action.payload?.totalCustomers,
        loading: false
      };

    case GET_CUSTOMERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };

    case ADD_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ON_UPDATE_CUSTOMER_SUCCESS:
      const updatedCustomers = state.customers.map(customer =>
        customer._id === action.payload._id ? action.payload : customer
      );
      return {
        ...state,
        customers: updatedCustomers,
        customer: action.payload,
        loading: false
      };

    case ON_UPDATE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ON_DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload._id),
      };

    case ON_DELETE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        customer: action.payload,
      };

    case GET_CUSTOMER_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CUSTOMER_ORDERS:
      return {
        ...state,
        loading: true
      };

    case GET_CUSTOMER_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        loading: false
      };

    case GET_CUSTOMER_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case GET_CUSTOMER_ENQUIRIES_SUCCESS:
      return {
        ...state,
        enquiries: action.payload.enquiries,
        totalEnquiries: action.payload.totalEnquiries,
        loading: false
      };

    case GET_CUSTOMER_ENQUIRIES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
      case GET_ALL_CUSTOMERS:
        return {
          ...state,
          loading: true
        };
      case GET_ALL_CUSTOMERS_SUCCESS:
        return {
          ...state,
          allCustomers: action?.payload || [],
          loading: false
        };
      case GET_ALL_CUSTOMERS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return {
        ...state
      };
  }
};

export default Customer;
