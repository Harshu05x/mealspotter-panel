import { call, put, takeEvery } from "redux-saga/effects";

// Ecommerce Redux States
import {
  GET_TOYS,
  ADD_NEW_TOY,
  DELETE_TOY,
  UPDATE_TOY,
  UPDATE_TOY_AVAILABILITY,
} from "./actionTypes";

import { GET_CATEGORIES, } from "../categories/actionTypes";

import {
  getToysFail,
  getToysSuccess,
  getShopsSuccess,
  addToyFail,
  addToySuccess,
  updateToySuccess,
  updateToyFail,
  deleteToySuccess,
  deleteToyFail,
  updateToyAvailability,
  updateToyAvailabilitySuccess,
  updateToyAvailabilityFail,
  setLoading,
} from "./actions";

import {
  getCategoriesFail,
  getCategoriesSuccess,
} from "../categories/actions";

//Include Both Helper File with needed methods
import {
  getToys,
  addNewToy,
  updateToy,
  deleteToy,
  updateToysAvailability,
} from "helpers/toys_helper";
import { getCategories } from "helpers/category_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchProducts() {
  try {
    const response = yield call(getProducts);
    yield put(getProductsSuccess(response));
  } catch (error) {
    yield put(getProductsFail(error));
  }
}

function* fetchProductDetail({ productId }) {
  try {
    const response = yield call(getProductDetail, productId);
    yield put(getProductDetailSuccess(response));
  } catch (error) {
    yield put(getProductDetailFail(error));
  }
}

function* fetchToys({ payload: { page, limit, query, status, category, type } }) {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getToys, page, limit, query, status, category, type);
    yield put(getToysSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getToysFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateToy({ payload: toy }) {
  try {
    yield put(setLoading(true));
    const response = yield call(updateToy, toy);
    yield put(updateToySuccess(response));
    toast.success("Toy Update Successfully.");
  } catch (error) {
    yield put(updateToyFail(error));
    let msg = error?.response?.data?.error || "Toy Update Failed"
    toast.error(msg);
  }
}

function* onDeleteToy({ payload: toy }) {
  try {
    const response = yield call(deleteToy, toy);
    yield put(deleteToySuccess(toy));
    toast.success("Toy Delete Successfully");
  } catch (error) {
    yield put(deleteToyFail(error));
    let msg = error?.response?.data?.error || "Toy Delete Failed"
    toast.error(msg);
  }
}

function* onAddNewToy({ payload: toy }) {
  try {
    yield put(setLoading(true));
    const response = yield call(addNewToy, toy);
    yield put(addToySuccess(response));
    toast.success("Toy Added Successfully");
  } catch (error) {
    yield put(addToyFail(error));
    let msg = error?.response?.data?.error || "Toy Added Failed"
    toast.error(msg);
  }
}

function* getProductComents() {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(getProductComentsApi);
    yield put(getProductCommentsSuccess(response));
  } catch (error) {
    yield put(getProductCommentsFail(error));
  }
}

function* onLikeComment({ payload: { commentId, productId } }) {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(onLikeCommentApi, commentId, productId);
    yield put(onLikeCommentSuccess(response));
  } catch (error) {
    yield put(onLikeCommentFail(error));
  }
}

function* onLikeReply({ payload: { commentId, productId, replyId } }) {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(onLikeReplyApi, commentId, productId, replyId);
    yield put(onLikeReplySuccess(response));
  } catch (error) {
    yield put(onLikeReplyFail(error));
  }
}

function* onAddReply({ payload: { commentId, productId, replyText } }) {
  try {
    const response = yield call(onAddReplyApi, commentId, productId, replyText);
    yield put(onAddReplySuccess(response));
  } catch (error) {
    yield put(onAddReplyFail(error));
  }
}

function* onAddComment({ payload: { productId, commentText } }) {
  try {
    const response = yield call(onAddCommentApi, productId, commentText);
    yield put(onAddCommentSuccess(response));
  } catch (error) {
    yield put(onAddCommentFail(error));
  }
}

function* onUpdateToyAvailability({ payload: { toyId, isAvailable } }) {
  try {
    const response = yield call(updateToysAvailability, toyId, isAvailable);

    // Dispatch success action
    yield put(updateToyAvailabilitySuccess(response));
    // Dispatch action to update isAvailable in Redux state
    yield put(updateToyAvailability(toyId, isAvailable));
    toast.success("Toy Availability Updated Successfully");
  } catch (error) {
    yield put(updateToyAvailabilityFail(error));
    toast.error("Toy Availability Update Failed");
  }
}

function* fetchCategories() {
  try {
    const response = yield call(getCategories);
    yield put(getCategoriesSuccess(response));
  } catch (error) {
    yield put(getCategoriesFail(error));
  }
}

function* toySaga() {
  yield takeEvery(GET_TOYS, fetchToys);
  yield takeEvery(ADD_NEW_TOY, onAddNewToy);
  yield takeEvery(UPDATE_TOY, onUpdateToy);
  yield takeEvery(DELETE_TOY, onDeleteToy);
  yield takeEvery(UPDATE_TOY_AVAILABILITY, onUpdateToyAvailability);
  yield takeEvery(GET_CATEGORIES, fetchCategories);
}

export default toySaga;
