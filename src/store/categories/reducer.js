import {
  GET_CATEGORIES_FAIL,
  GET_CATEGORIES_SUCCESS,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL
} from "./actionTypes";

const INIT_STATE = {
  categories: [],
  toy: {},
  error: {},
  loading: true
};

const Category = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: true
      };

    case GET_CATEGORIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case ADD_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map(category =>
          (category._id + '') === (action.payload._id + '')
            ? { category, ...action.payload }
            : category
        ),
      };

    case UPDATE_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter(
          category => category._id !== action?.payload?._id
        ),
      };

    case DELETE_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default Category;
