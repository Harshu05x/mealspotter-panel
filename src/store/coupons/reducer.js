// store/coupons/reducer.js

import {
    GET_COUPONS_FAIL,
    GET_COUPONS_SUCCESS,
    ADD_COUPON_SUCCESS,
    ADD_COUPON_FAIL,
    UPDATE_COUPON_SUCCESS,
    UPDATE_COUPON_FAIL,
    DELETE_COUPON_SUCCESS,
    DELETE_COUPON_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    coupons: [],
    coupon: {},
    error: {},
    loading: true
};

const Coupon = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_COUPONS_SUCCESS:
            return {
                ...state,
                coupons: action.payload,
                loading: true
            };

        case GET_COUPONS_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case ADD_COUPON_SUCCESS:
            return {
                ...state,
                coupons: [...state.coupons, action.payload],
            };

        case ADD_COUPON_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case UPDATE_COUPON_SUCCESS:
            return {
                ...state,
                coupons: state.coupons.map(coupon =>
                    (coupon._id + '') === (action.payload._id + '')
                        ? { coupon, ...action.payload }
                        : coupon
                ),
            };

        case UPDATE_COUPON_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case DELETE_COUPON_SUCCESS:
            return {
                ...state,
                coupons: state.coupons.filter(
                    coupon => coupon._id !== action?.payload?._id
                ),
            };

        case DELETE_COUPON_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default Coupon;
