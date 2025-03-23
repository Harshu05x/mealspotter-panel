import { call, put, takeEvery } from "redux-saga/effects";

// Zone Redux States
import {
  GET_ZONES,
  ADD_NEW_ZONE,
  DELETE_ZONE,
  UPDATE_ZONE,
} from "./actionTypes";
import {
  getZonesFail,
  getZonesSuccess,
  addZoneSuccess,
  addZoneFail,
  updateZoneSuccess,
  updateZoneFail,
  deleteZoneSuccess,
  deleteZoneFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getZones,
 addNewZone,
 updateZone,
 deleteZone
} from "helpers/zone_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchZones() {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getZones);
    yield put(getZonesSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getZonesFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateZone({ payload: category }) {
  try {
    
    yield call(updateZone, category);
    const response = yield call(getZones);
    yield put(getZonesSuccess(response));
    toast.success("Zone Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateZoneFail(error));
    let msg = error?.response?.data?.msg || "Zone Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteZone({ payload: category }) {
  try {
    const response = yield call(deleteZone, category);
    yield put(deleteZoneSuccess(response));
    toast.success("Zone Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteZoneFail(error));
    toast.error("Zone Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewZone({ payload: category }) {
  try {
    const response = yield call(addNewZone, category);
    yield put(addZoneSuccess(response));
    toast.success("Zone Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "Zone Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addZoneFail(error));
  }
}


function* categorySaga() {
  yield takeEvery(GET_ZONES, fetchZones);
  yield takeEvery(ADD_NEW_ZONE, onAddNewZone);
  yield takeEvery(UPDATE_ZONE, onUpdateZone);
  yield takeEvery(DELETE_ZONE, onDeleteZone);
}

export default categorySaga;
