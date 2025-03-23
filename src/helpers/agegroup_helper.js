import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getAgeGroups = () => get(url.AGEGROUPS);

// add toy
export const addNewAgeGroup = ageGroup => post(url.AGEGROUPS, ageGroup);

// update toy
export const updateAgeGroup = ageGroup => put(url.AGEGROUPS + "/" + ageGroup._id, ageGroup);

// delete toy
export const deleteAgeGroup = ageGroup =>
  del(url.AGEGROUPS + "/" + ageGroup);