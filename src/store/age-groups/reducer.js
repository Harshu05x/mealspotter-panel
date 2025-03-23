import {
  GET_AGEGROUPS_FAIL,
  GET_AGEGROUPS_SUCCESS,
  ADD_AGEGROUP_SUCCESS,
  ADD_AGEGROUP_FAIL,
  UPDATE_AGEGROUP_SUCCESS,
  UPDATE_AGEGROUP_FAIL,
  DELETE_AGEGROUP_SUCCESS,
  DELETE_AGEGROUP_FAIL
} from "./actionTypes";

const INIT_STATE = {
  ageGroups: [],
  toy: {},
  error: {},
  loading: true
};

const AgeGroup = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_AGEGROUPS_SUCCESS:
      return {
        ...state,
        ageGroups: action.payload,
        loading: true
      };

    case GET_AGEGROUPS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_AGEGROUP_SUCCESS:
      return {
        ...state,
        ageGroups: [...state.ageGroups, action.payload],
      };

    case ADD_AGEGROUP_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_AGEGROUP_SUCCESS:
      return {
        ...state,
        ageGroups: state.ageGroups.map(ageGroup =>
          (ageGroup._id + '') === (action.payload._id + '')
            ? { ageGroup, ...action.payload }
            : ageGroup
        ),
      };

    case UPDATE_AGEGROUP_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_AGEGROUP_SUCCESS:
      return {
        ...state,
        ageGroups: state.ageGroups.filter(
          ageGroup => ageGroup._id !== action?.payload?._id
        ),
      };

    case DELETE_AGEGROUP_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default AgeGroup;
