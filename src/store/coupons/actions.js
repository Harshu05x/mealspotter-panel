
import {
  GET_COUPONS,
  GET_COUPONS_FAIL,
  GET_COUPONS_SUCCESS,
  ADD_NEW_COUPON,
  ADD_COUPON_SUCCESS,
  ADD_COUPON_FAIL,
  UPDATE_COUPON,
  UPDATE_COUPON_SUCCESS,
  UPDATE_COUPON_FAIL,
  DELETE_COUPON,
  DELETE_COUPON_SUCCESS,
  DELETE_COUPON_FAIL,
} from "./actionTypes";

export const getCoupons = () => ({
  type: GET_COUPONS,
});

export const getCouponsSuccess = coupons => ({
  type: GET_COUPONS_SUCCESS,
  payload: coupons,
});

export const getCouponsFail = error => ({
  type: GET_COUPONS_FAIL,
  payload: error,
});

export const addNewCoupon = coupon => ({
  type: ADD_NEW_COUPON,
  payload: coupon,
});

export const addCouponSuccess = coupon => ({
  type: ADD_COUPON_SUCCESS,
  payload: coupon,
});

export const addCouponFail = error => ({
  type: ADD_COUPON_FAIL,
  payload: error,
});

export const updateCoupon = coupon => ({
  type: UPDATE_COUPON,
  payload: coupon,
});

export const updateCouponSuccess = coupon => ({
  type: UPDATE_COUPON_SUCCESS,
  payload: coupon,
});

export const updateCouponFail = error => ({
  type: UPDATE_COUPON_FAIL,
  payload: error,
});

export const deleteCoupon = coupon => ({
  type: DELETE_COUPON,
  payload: coupon,
});

export const deleteCouponSuccess = coupon => ({
  type: DELETE_COUPON_SUCCESS,
  payload: coupon,
});

export const deleteCouponFail = error => ({
  type: DELETE_COUPON_FAIL,
  payload: error,
});
