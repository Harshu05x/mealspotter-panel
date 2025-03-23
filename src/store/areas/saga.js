import { call, put, takeEvery } from "redux-saga/effects";

// Area Redux States
import {
  GET_AREAS,
  ADD_NEW_AREA,
  DELETE_AREA,
  UPDATE_AREA,
} from "./actionTypes";
import {
  getAreasFail,
  getAreasSuccess,
  addAreaSuccess,
  addAreaFail,
  updateAreaSuccess,
  updateAreaFail,
  deleteAreaSuccess,
  deleteAreaFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getAreas,
 addNewArea,
 updateArea,
 deleteArea
} from "helpers/area_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchAreas({payload: filter}) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getAreas, filter);
    yield put(getAreasSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getAreasFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateArea({ payload: area }) {
  try {
    
    const response = yield call(updateArea, area);
    yield put(updateAreaSuccess(response));
    toast.success("Area Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateAreaFail(error));
    let msg = error?.response?.data?.msg || "Area Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteArea({ payload: area }) {
  try {
    const response = yield call(deleteArea, area);
    yield put(deleteAreaSuccess(response));
    toast.success("Area Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteAreaFail(error));
    toast.error("Area Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewArea({ payload: area }) {
  try {
    const response = yield call(addNewArea, area);
    yield put(addAreaSuccess(response));
    toast.success("Area Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "Area Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addAreaFail(error));
  }
}


function* areaSaga() {
  yield takeEvery(GET_AREAS, fetchAreas);
  yield takeEvery(ADD_NEW_AREA, onAddNewArea);
  yield takeEvery(UPDATE_AREA, onUpdateArea);
  yield takeEvery(DELETE_AREA, onDeleteArea);
}

export default areaSaga;
