import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get coupons
export const getAllCoupons = () => get(url.COUPONS);

// add coupon
export const addNewCoupon = coupon => post(url.COUPONS, coupon);

// update coupon
export const updateCoupon = coupon => {
  console.log("Coupon id from Helper: ", coupon._id);
  return put(url.COUPONS + "/" + coupon._id, coupon);
}

// delete coupon
export const deleteCoupon = coupon => {
  console.log("Coupon id from Helper: ", coupon);
  return del(url.COUPONS + "/" + coupon, coupon);
}
