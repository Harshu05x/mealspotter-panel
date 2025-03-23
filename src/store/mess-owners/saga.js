import { call, put, takeEvery } from "redux-saga/effects";

// City Redux States
import {
  GET_MESS_OWNERS,
  ADD_NEW_MESS_OWNER,
  DELETE_MESS_OWNER,
  UPDATE_MESS_OWNER,
} from "./actionTypes";
import {
  getMessOwnersFail,
  getMessOwnersSuccess,
  addMessOwnerSuccess,
  addMessOwnerFail,
  updateMessOwnerSuccess,
  updateMessOwnerFail,
  deleteMessOwnerSuccess,
  deleteMessOwnerFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getMessOwners,
 addNewMessOwner,
 updateMessOwner,
 deleteMessOwner
} from "helpers/mess_owner_helper"
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchMessOwners({payload: filter}) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getMessOwners, filter);
    yield put(getMessOwnersSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getMessOwnersFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateMessOwner({ payload: category }) {
  try {
    
    const response = yield call(updateMessOwner, category);
    yield put(updateMessOwnerSuccess(response));
    toast.success("Mess Owner Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateMessOwnerFail(error));
    let msg = error?.response?.data?.msg || "Mess Owner Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteMessOwner({ payload: category }) {
  try {
    const response = yield call(deleteMessOwner, category);
    yield put(deleteMessOwnerSuccess(response));
    toast.success("Mess Owner Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteMessOwnerFail(error));
    toast.error("Mess Owner Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewMessOwner({ payload: category }) {
  try {
    const response = yield call(addNewMessOwner, category);
    yield put(addMessOwnerSuccess(response));
    toast.success("Mess Owner Added Successfully", { autoClose: 2000 });
  } catch (error) {
    console.log("error", error);
    let msg = error?.response?.data?.msg || "Mess Owner Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addMessOwnerFail(error));
  }
}


function* messOwnerSaga() {    
  yield takeEvery(GET_MESS_OWNERS, fetchMessOwners);
  yield takeEvery(ADD_NEW_MESS_OWNER, onAddNewMessOwner);
  yield takeEvery(UPDATE_MESS_OWNER, onUpdateMessOwner);
  yield takeEvery(DELETE_MESS_OWNER, onDeleteMessOwner);
}

export default messOwnerSaga; 
