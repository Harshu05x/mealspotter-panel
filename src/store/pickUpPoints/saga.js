import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_PICKUP_POINTS,
  UPDATE_PICKUP_POINT,
  DELETE_PICKUP_POINT,
  ADD_PICKUP_POINT,
} from "./actionTypes";

import {
  getPickUpPointsSuccess,
  getPickUpPointsFail,
  updatePickUpPointFail,
  deletePickUpPointSuccess,
  deletePickUpPointFail,
  addPickUpPointSuccess,
  addPickUpPointFail
} from "./actions";

// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  getPickUpPoints, 
  updatePickUpPoint, 
  addNewPickUpPoint, 
  deletePickUpPoint 
} from "helpers/pickUpPoint_helper";
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchPickUpPoints() {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getPickUpPoints);
    yield put(getPickUpPointsSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getPickUpPointsFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.msg || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}

function* onUpdatePickUpPoint({ payload: category }) {
  try {
    yield call(updatePickUpPoint, category);
    const response = yield call(getPickUpPoints);
    yield put(getPickUpPointsSuccess(response));
    toast.success("PickUpPoint Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updatePickUpPointFail(error));
    toast.error("PickUpPoint Update Failed", { autoClose: 2000 });
  }
}

function* onDeletePickUpPoint({ payload: category }) {
  try{
    const response = yield call(deletePickUpPoint, category);
    yield put(deletePickUpPointSuccess(response));
    toast.success("PickUpPoint Deleted Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deletePickUpPointFail(error));
    let msg = error?.response?.data?.msg || "PickUpPoint Delete Failed";
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onAddNewPickUpPoint({ payload: category }) {
  try {
    const response = yield call(addNewPickUpPoint, category);
    yield put(addPickUpPointSuccess(response));
    toast.success("PickUpPoint Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "PickUpPoint Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addPickUpPointFail(error));
  }
}


function* categorySaga() {
  yield takeEvery(GET_PICKUP_POINTS, fetchPickUpPoints);
  yield takeEvery(UPDATE_PICKUP_POINT, onUpdatePickUpPoint);
  yield takeEvery(DELETE_PICKUP_POINT, onDeletePickUpPoint);
  yield takeEvery(ADD_PICKUP_POINT, onAddNewPickUpPoint);
}

export default categorySaga;
