import { all, fork } from "redux-saga/effects";

//public
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import LayoutSaga from "./layout/saga";
import dashboardSaga from "./dashboard/saga";
import categorySaga from "./categories/saga";
import ageGroupSaga from "./age-groups/saga";
import citySaga from "./cities/saga";
import zoneSaga from "./zones/saga";
import pickupPointSaga from "./pickUpPoints/saga";
import areaSaga from "./areas/saga";
import toySaga from "./toys/saga";
import customerSaga from "./customers/saga";
import OrderSaga from "./orders/saga";
import PaymentSaga from "./Payment/saga";
import couponSaga from "./coupons/saga";
import ProfileSaga from "./auth/profile/saga";
import DatesSaga from "./dates/saga";
import messOwnerSaga from "./mess-owners/saga";
export default function* rootSaga() {
  yield all([
    //public
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(LayoutSaga),
    fork(dashboardSaga),
    fork(categorySaga),
    fork(ageGroupSaga),
    fork(citySaga),
    fork(zoneSaga),
    fork(pickupPointSaga),
    fork(areaSaga),
    fork(toySaga),
    fork(customerSaga),
    fork(OrderSaga),
    fork(PaymentSaga),
    fork(couponSaga),
    fork(ProfileSaga),
    fork(DatesSaga),
    fork(messOwnerSaga),
  ]);
}
