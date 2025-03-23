// store/coupons/saga.js

import { call, put, takeEvery } from "redux-saga/effects";
import {
    GET_COUPONS,
    ADD_NEW_COUPON,
    DELETE_COUPON,
    UPDATE_COUPON,
} from "./actionTypes";
import {
    getCouponsFail,
    getCouponsSuccess,
    addCouponSuccess,
    addCouponFail,
    updateCouponSuccess,
    updateCouponFail,
    deleteCouponSuccess,
    deleteCouponFail
} from "./actions";
import {
    getAllCoupons,
    addNewCoupon,
    updateCoupon,
    deleteCoupon
} from "helpers/coupon_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchCoupons() {
    try {
        yield put(setSystemLoading(true));
        const response = yield call(getAllCoupons);
        yield put(getCouponsSuccess(response));
        yield put(setSystemError(false));
        yield put(setSystemLoading(false));
    } catch (error) {
        yield put(getCouponsFail(error));
        let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
        yield put(setSystemError(errorMessage));
    }
}

function* onUpdateCoupon({ payload: coupon }) {
    try {
        const response = yield call(updateCoupon, coupon);
        yield put(updateCouponSuccess(response));
        toast.success("Coupon Updated Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(updateCouponFail(error));
        let msg = error?.response?.data?.msg || "Coupon Update Failed";
        toast.error(msg, { autoClose: 2000 });
    }
}

function* onDeleteCoupon({ payload: couponId }) {
    try {
        const response = yield call(deleteCoupon, couponId);
        yield put(deleteCouponSuccess(response));
        toast.success("Coupon Deleted Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(deleteCouponFail(error));
        toast.error("Coupon Deletion Failed", { autoClose: 2000 });
    }
}

function* onAddNewCoupon({ payload: coupon }) {
    try {
        const response = yield call(addNewCoupon, coupon);
        yield put(addCouponSuccess(response));
        toast.success("Coupon Added Successfully", { autoClose: 2000 });
    } catch (error) {
        let msg = error?.response?.data?.msg || "Coupon Failed to Add";
        toast.error(msg, { autoClose: 2000 });
        yield put(addCouponFail(error));
    }
}

function* couponSaga() {
    yield takeEvery(GET_COUPONS, fetchCoupons);
    yield takeEvery(ADD_NEW_COUPON, onAddNewCoupon);
    yield takeEvery(UPDATE_COUPON, onUpdateCoupon);
    yield takeEvery(DELETE_COUPON, onDeleteCoupon);
}

export default couponSaga;
