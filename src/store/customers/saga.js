import { call, put, takeEvery } from "redux-saga/effects";

// Customer Redux States
import {
  GET_CUSTOMERS,
  ADD_NEW_CUSTOMER,
  ON_DELETE_CUSTOMER,
  ON_UPDATE_CUSTOMER,
  GET_CUSTOMER_DETAILS,
  GET_CUSTOMER_ORDERS,
  ON_UPDATE_PASSWORD,
  GET_CUSTOMER_ENQUIRIES,
  GET_ALL_CUSTOMERS,
} from "./actionTypes";
import {
  getCustomersFail,
  getCustomersSuccess,
  addCustomerSuccess,
  addCustomerFail,
  updateCustomerSuccess,
  updateCustomerFail,
  deleteCustomerSuccess,
  deleteCustomerFail,
  getCustomerDetailsSuccess,
  getCustomerDetailsFail,
  getCustomerOrdersSuccess,
  getCustomerOrdersFail,
  getCustomerEnquiriesFail,
  getCustomerEnquiriesSuccess,
  getAllCustomersSuccess,
  getAllCustomersFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCustomers,
  getCustomerDetailsById,
  getCustomerOrders,
  updateCustomer,
  deleteCustomer,
  updatePassword,
  getEnquiries,
  getAllCustomers
} from "helpers/customer_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchCustomers({ payload: { enquiry,page, limit, query }}) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getCustomers, enquiry,page, limit, query);
    yield put(getCustomersSuccess(response));
    yield put(setSystemLoading(false));
    yield put(setSystemError(false));
  } catch (error) {
    yield put(getCustomersFail(error));
    let msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Customers Fetch Failed";
    yield put(setSystemError(msg));
  }
}

function* fetchEnquiries({ payload: {page, limit, query}}) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getEnquiries, page, limit, query);
    yield put(getCustomerEnquiriesSuccess(response));
    yield put(setSystemLoading(false));
    yield put(setSystemError(false));
  } catch (error) {
    yield put(getCustomerEnquiriesFail(error));
    let msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Enquiries Fetch Failed";
    yield put(setSystemError(msg));
  }
}

function* onUpdateCustomer({ payload: ageGroup }) {
  try {

    const response = yield call(updateCustomer, ageGroup);
    yield put(updateCustomerSuccess(response));
    toast.success("Customer Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateCustomerFail(error));
    let msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.msg || "Customer Update Failed";
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteCustomer({ payload: ageGroup }) {
  try {
    const response = yield call(deleteCustomer, ageGroup);
    yield put(deleteCustomerSuccess(response));
    toast.success("Customer Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCustomerFail(error));
    const msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Customer Delete Failed";
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onAddNewCustomer({ payload: ageGroup }) {
  try {
    const response = yield call(addNewCustomer, ageGroup);
    yield put(addCustomerSuccess(response));
    toast.success("Customer Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.msg || "Customer Added Failed";
    toast.error(msg, { autoClose: 2000 });

    yield put(addCustomerFail(error));
  }
}

function* onGetCustomerDetails({ payload: customerId }) {
  try {
    const response = yield call(getCustomerDetailsById, customerId);
    yield put(getCustomerDetailsSuccess(response));
  } catch (error) {
    yield put(getCustomerDetailsFail(error));
  }
}

function* onGetCustomerOrders({ payload: customerId }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getCustomerOrders, customerId);
    yield put(getCustomerOrdersSuccess(response));
    yield put(setSystemLoading(false));
    yield put(setSystemError(false));
  } catch (error) {
    yield put(getCustomerOrdersFail(error));
    let msg = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Customer Orders Fetch Failed";
    yield put(setSystemError(msg));
  }
}

function* fetchAllCustomers({ payload: {query, searchType}}) {
  try {
    const response = yield call(getAllCustomers, query, searchType);
    yield put(getAllCustomersSuccess(response));
  } catch (error) {
    console.log("error", error);
    yield put(getAllCustomersFail(error));
  }
}

function* customerSaga() {
  yield takeEvery(GET_CUSTOMERS, fetchCustomers);
  yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
  yield takeEvery(ON_UPDATE_CUSTOMER, onUpdateCustomer);
  yield takeEvery(ON_DELETE_CUSTOMER, onDeleteCustomer);
  yield takeEvery(GET_CUSTOMER_DETAILS, onGetCustomerDetails);
  yield takeEvery(GET_CUSTOMER_ORDERS, onGetCustomerOrders);
  yield takeEvery(GET_CUSTOMER_ENQUIRIES, fetchEnquiries);
  yield takeEvery(GET_ALL_CUSTOMERS, fetchAllCustomers);
}

export default customerSaga;
