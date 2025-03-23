import { call, put, takeEvery } from "redux-saga/effects";

// City Redux States
import {
  GET_CITIES,
  ADD_NEW_CITY,
  DELETE_CITY,
  UPDATE_CITY,
} from "./actionTypes";
import {
  getCitiesFail,
  getCitiesSuccess,
  addCitySuccess,
  addCityFail,
  updateCitySuccess,
  updateCityFail,
  deleteCitySuccess,
  deleteCityFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getCities,
 addNewCity,
 updateCity,
 deleteCity
} from "helpers/city_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchCities({payload: filter}) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getCities, filter);
    yield put(getCitiesSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getCitiesFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateCity({ payload: category }) {
  try {
    
    const response = yield call(updateCity, category);
    yield put(updateCitySuccess(response));
    toast.success("City Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateCityFail(error));
    let msg = error?.response?.data?.msg || "City Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteCity({ payload: category }) {
  try {
    const response = yield call(deleteCity, category);
    yield put(deleteCitySuccess(response));
    toast.success("City Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCityFail(error));
    toast.error("City Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewCity({ payload: category }) {
  try {
    const response = yield call(addNewCity, category);
    yield put(addCitySuccess(response));
    toast.success("City Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "City Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addCityFail(error));
  }
}


function* citySaga() {
  yield takeEvery(GET_CITIES, fetchCities);
  yield takeEvery(ADD_NEW_CITY, onAddNewCity);
  yield takeEvery(UPDATE_CITY, onUpdateCity);
  yield takeEvery(DELETE_CITY, onDeleteCity);
}

export default citySaga;
