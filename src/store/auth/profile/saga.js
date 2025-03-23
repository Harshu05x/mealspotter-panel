import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { EDIT_PROFILE, GET_USER_PROFILE, UPDATE_USER_PASSWORD } from "./actionTypes"
import { profileSuccess, profileError, getUserProfileSuccess, getUserProfileError } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { getJWTUser, updateUserPwd } from "helpers/auth_helper"
import { toast } from "react-toastify"
// import {
//   postFakeProfile,
//   postJwtProfile,
// } from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

function* editProfile({ payload: { user } }) {
  try {
    console.log(user);
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.editProfileAPI,
        user.username,
        user.idx
      )
      yield put(profileSuccess(response))      
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      // const response = yield call(postFakeProfile, {
      //   username: user.username,
      //   idx: user.idx,
      // })
      // yield put(profileSuccess(response))
    }
  } catch (error) {
    console.log(error);
    yield put(profileError(error))
  }
}

function* getUserProfile() {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // const response = yield call(fireBaseBackend.getUserProfileAPI)
      // yield put(getUserProfileSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(getJWTUser);
      yield put(getUserProfileSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      // const response = yield call(postFakeProfile)
      // yield put(getUserProfileSuccess(response))
    }
  } catch (error) {
    console.log(error);
    yield put(getUserProfileError(error))
  }
}

function* updateUserPassword({ payload: data  }) {
  try {
    const response = yield call(updateUserPwd, data);
    toast.success("Password changed successfully");
  } catch (error) {
    console.log(error);
    let msg = error?.response?.data?.msg || "Error in change password";
    toast.error(msg);
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile),
  yield takeEvery(GET_USER_PROFILE, getUserProfile);
  yield takeEvery(UPDATE_USER_PASSWORD, updateUserPassword)
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
