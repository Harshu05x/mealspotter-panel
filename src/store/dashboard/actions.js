import {
    API_SUCCESS,
    API_FAIL, GET_DASHBOARD_COUNTS,
    GET_DASHBOARD_COUNT_FAIL,
    GET_DASHBOARD_COUNTS_SUCCESS,
    GET_DASHBOARD_TOP_RENTED_TOYS,
    GET_DASHBOARD_TOP_RENTED_TOYS_SUCCESS,
    GET_DASHBOARD_TOP_RENTED_TOYS_FAIL
} from "./actionTypes";

export const apiSuccess = (actionType, data) => ({
    type: API_SUCCESS,
    payload: { actionType, data },
});

export const apiFail = (actionType, error) => ({
    type: API_FAIL,
    payload: { actionType, error },
});


// Dashboard counts data
export const getDashboardCounts = () => ({
    type: GET_DASHBOARD_COUNTS,
    payload: {},
});

export const getDashboardCountsSuccess = dashboardCounts => ({
    type: GET_DASHBOARD_COUNTS_SUCCESS,
    payload: dashboardCounts,
})

export const getDashboardCountsFail = error => ({
    type: GET_DASHBOARD_COUNT_FAIL,
    payload: error,
})

export const getDashboardTopRentedToys = () => ({
    type: GET_DASHBOARD_TOP_RENTED_TOYS,
    payload: {},
});

export const getDashboardTopRentedToysSuccess = topRentedToys => ({
    type: GET_DASHBOARD_TOP_RENTED_TOYS_SUCCESS,
    payload: topRentedToys,
})

export const getDashboardTopRentedToysFail = error => ({
    type: GET_DASHBOARD_TOP_RENTED_TOYS_FAIL,
    payload: error,
})