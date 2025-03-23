import {
    GET_DASHBOARD_COUNTS_SUCCESS,
    GET_DASHBOARD_COUNT_FAIL,
    GET_DASHBOARD_TOP_RENTED_TOYS_FAIL,
    GET_DASHBOARD_TOP_RENTED_TOYS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    dashboardCounts: {},
    topRentedToys: {},
    error: {},
    loading: true
};

const Dashboard = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_DASHBOARD_COUNTS_SUCCESS:
            return {
                ...state,
                dashboardCounts: action.payload,
                loading: false
            };
        case GET_DASHBOARD_COUNT_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case GET_DASHBOARD_TOP_RENTED_TOYS_SUCCESS:
            return {
                ...state,
                topRentedToys: action.payload,
                loading: false
            };
        case GET_DASHBOARD_TOP_RENTED_TOYS_FAIL: 
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default Dashboard;