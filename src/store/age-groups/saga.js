import { call, put, takeEvery } from "redux-saga/effects";

// AgeGroup Redux States
import {
  GET_AGEGROUPS,
  ADD_NEW_AGEGROUP,
  DELETE_AGEGROUP,
  UPDATE_AGEGROUP,
} from "./actionTypes";
import {
  getAgeGroupsFail,
  getAgeGroupsSuccess,
  addAgeGroupSuccess,
  addAgeGroupFail,
  updateAgeGroupSuccess,
  updateAgeGroupFail,
  deleteAgeGroupSuccess,
  deleteAgeGroupFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getAgeGroups,
 addNewAgeGroup,
 updateAgeGroup,
 deleteAgeGroup
} from "helpers/agegroup_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchAgeGroups() {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getAgeGroups);
    yield put(getAgeGroupsSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getAgeGroupsFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateAgeGroup({ payload: ageGroup }) {
  try {
    
    const response = yield call(updateAgeGroup, ageGroup);
    yield put(updateAgeGroupSuccess(response));
    toast.success("AgeGroup Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateAgeGroupFail(error));
    let msg = error?.response?.data?.msg || "AgeGroup Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteAgeGroup({ payload: ageGroup }) {
  try {
    const response = yield call(deleteAgeGroup, ageGroup);
    yield put(deleteAgeGroupSuccess(response));
    toast.success("AgeGroup Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteAgeGroupFail(error));
    toast.error("AgeGroup Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewAgeGroup({ payload: ageGroup }) {
  try {
    const response = yield call(addNewAgeGroup, ageGroup);
    yield put(addAgeGroupSuccess(response));
    toast.success("AgeGroup Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "AgeGroup Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addAgeGroupFail(error));
  }
}


function* ageGroupSaga() {
  yield takeEvery(GET_AGEGROUPS, fetchAgeGroups);
  yield takeEvery(ADD_NEW_AGEGROUP, onAddNewAgeGroup);
  yield takeEvery(UPDATE_AGEGROUP, onUpdateAgeGroup);
  yield takeEvery(DELETE_AGEGROUP, onDeleteAgeGroup);
}

export default ageGroupSaga;
