import { call, put, takeEvery } from "redux-saga/effects";

// Category Redux States
import {
  GET_CATEGORIES,
  ADD_NEW_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "./actionTypes";
import {
  getCategoriesFail,
  getCategoriesSuccess,
  addCategorySuccess,
  addCategoryFail,
  updateCategorySuccess,
  updateCategoryFail,
  deleteCategorySuccess,
  deleteCategoryFail
  
} from "./actions";

//Include Both Helper File with needed methods
import {
 getCategories,
 addNewCategory,
 updateCategory,
 deleteCategory
} from "helpers/category_helper";
// toast
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setSystemError, setSystemLoading } from "store/actions";

function* fetchCategories() {
  try {
    yield put(setSystemLoading(true));
    const response = yield call(getCategories);
    yield put(getCategoriesSuccess(response));
    yield put(setSystemError(false));
    yield put(setSystemLoading(false));
  } catch (error) {
    yield put(getCategoriesFail(error));
    let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.error || "Something went wrong";
    yield put(setSystemError(errorMessage));
  }
}



function* onUpdateCategory({ payload: category }) {
  try {
    
    const response = yield call(updateCategory, category);
    yield put(updateCategorySuccess(response));
    toast.success("Category Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateCategoryFail(error));
    let msg = error?.response?.data?.msg || "Category Update Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onDeleteCategory({ payload: category }) {
  try {
    const response = yield call(deleteCategory, category);
    yield put(deleteCategorySuccess(response));
    toast.success("Category Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCategoryFail(error));
    let msg = error?.response?.data?.error || "Category Delete Failed"; 
    toast.error(msg, { autoClose: 2000 });
  }
}

function* onAddNewCategory({ payload: category }) {
  try {
    const response = yield call(addNewCategory, category);
    yield put(addCategorySuccess(response));
    toast.success("Category Added Successfully", { autoClose: 2000 });
  } catch (error) {
    let msg = error?.response?.data?.msg || "Category Added Failed"; 
    toast.error(msg, { autoClose: 2000 });

    yield put(addCategoryFail(error));
  }
}


function* categorySaga() {
  yield takeEvery(GET_CATEGORIES, fetchCategories);
  yield takeEvery(ADD_NEW_CATEGORY, onAddNewCategory);
  yield takeEvery(UPDATE_CATEGORY, onUpdateCategory);
  yield takeEvery(DELETE_CATEGORY, onDeleteCategory);
}

export default categorySaga;
