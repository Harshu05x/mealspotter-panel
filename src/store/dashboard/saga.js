import { call, put, takeEvery } from "redux-saga/effects";

// Dashboard Redux States
import {
    GET_DASHBOARD_COUNTS, GET_DASHBOARD_TOP_RENTED_TOYS,
} from "./actionTypes";
import {
    getDashboardCounts,
    getDashboardCountsFail,
    getDashboardCountsSuccess,
    getDashboardTopRentedToysFail,
    getDashboardTopRentedToysSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import { fetchDashboardApi, fetchDashboardTopRentedToysApi } from "helpers/dashboard_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function* fetchDashboardCounts() {
    try {
        const response = yield call(fetchDashboardApi);
        yield put(getDashboardCountsSuccess(response));
    } catch (error) {
        yield put(getDashboardCountsFail(error));
    }
}

function* fetchDashboardTopRentedToys() {
    try {
        const response = yield call(fetchDashboardTopRentedToysApi);
        yield put(getDashboardTopRentedToysSuccess(response));
    } catch (error) {
        yield put(getDashboardTopRentedToysFail(error));
    }
}

function* dashboardSaga() {
    yield takeEvery(GET_DASHBOARD_COUNTS, fetchDashboardCounts);
    yield takeEvery(GET_DASHBOARD_TOP_RENTED_TOYS, fetchDashboardTopRentedToys);
}

export default dashboardSaga;
