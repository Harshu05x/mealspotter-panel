import {
  GET_CUSTOMERS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  ADD_NEW_CUSTOMER,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  ON_UPDATE_CUSTOMER,
  ON_UPDATE_CUSTOMER_SUCCESS,
  ON_UPDATE_CUSTOMER_FAIL,
  ON_DELETE_CUSTOMER,
  ON_DELETE_CUSTOMER_SUCCESS,
  ON_DELETE_CUSTOMER_FAIL,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GET_CUSTOMER_DETAILS_FAIL,
  GET_CUSTOMER_DETAILS,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDERS_SUCCESS,
  GET_CUSTOMER_ORDERS_FAIL,
  GET_CUSTOMER_ENQUIRIES,
  GET_CUSTOMER_ENQUIRIES_SUCCESS,
  GET_CUSTOMER_ENQUIRIES_FAIL,
  GET_ALL_CUSTOMERS,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAIL
} from "./actionTypes"

export const getCustomers = (enquiry,page, limit,query) => ({
  type: GET_CUSTOMERS,
  payload: {enquiry,page, limit, query},
})

export const getCustomersSuccess = customerId => ({
  type: GET_CUSTOMERS_SUCCESS,
  payload: customerId,
})

export const getCustomersFail = error => ({
  type: GET_CUSTOMERS_FAIL,
  payload: error,
})

export const addNewCustomer = customerId => ({
  type: ADD_NEW_CUSTOMER,
  payload: customerId,
})

export const addCustomerSuccess = customerId => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload: customerId,
})

export const addCustomerFail = error => ({
  type: ADD_CUSTOMER_FAIL,
  payload: error,
})

export const updateCustomer = customerId => ({
  type: ON_UPDATE_CUSTOMER,
  payload: customerId,
})

export const updateCustomerSuccess = customerId => ({
  type: ON_UPDATE_CUSTOMER_SUCCESS,
  payload: customerId,
})

export const updateCustomerFail = error => ({
  type: ON_UPDATE_CUSTOMER_FAIL,
  payload: error,
})

export const deleteCustomer = customerId => ({
  type: ON_DELETE_CUSTOMER,
  payload: customerId,
})

export const deleteCustomerSuccess = customerId => ({
  type: ON_DELETE_CUSTOMER_SUCCESS,
  payload: customerId,
})

export const deleteCustomerFail = error => ({
  type: ON_DELETE_CUSTOMER_FAIL,
  payload: error,
})

export const getCustomerDetails = customerId => ({
  type: GET_CUSTOMER_DETAILS,
  payload: customerId,
});

export const getCustomerDetailsSuccess = customer => ({
  type: GET_CUSTOMER_DETAILS_SUCCESS,
  payload: customer,
});

export const getCustomerDetailsFail = error => ({
  type: GET_CUSTOMER_DETAILS_FAIL,
  payload: error,
});

export const onGetCustomerOrders = customerId => ({
  type: GET_CUSTOMER_ORDERS,
  payload: customerId,
});

export const getCustomerOrdersSuccess = orders => ({
  type: GET_CUSTOMER_ORDERS_SUCCESS,
  payload: orders,
});

export const getCustomerOrdersFail = error => ({
  type: GET_CUSTOMER_ORDERS_FAIL,
  payload: error,
});

export const getCustomerEnquiries = (page, limit, query) => ({
  type: GET_CUSTOMER_ENQUIRIES,
  payload: { page, limit, query },
});

export const getCustomerEnquiriesSuccess = enquiries => ({
  type: GET_CUSTOMER_ENQUIRIES_SUCCESS,
  payload: enquiries,
});

export const getCustomerEnquiriesFail = error => ({
  type: GET_CUSTOMER_ENQUIRIES_FAIL,
  payload: error,
});

export const getAllCustomers = (query, searchType) => ({
  type: GET_ALL_CUSTOMERS,
  payload: { query, searchType },
})
export const getAllCustomersSuccess = customers => ({
  type: GET_ALL_CUSTOMERS_SUCCESS,
  payload: customers,
})
export const getAllCustomersFail = error => ({
  type: GET_ALL_CUSTOMERS_FAIL,
  payload: error,
})