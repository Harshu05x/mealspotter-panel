import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getCategories = () => get(url.CATEGORIES);

// add toy
export const addNewCategory = category => post(url.CATEGORIES, category);

// update toy
export const updateCategory = category => put(url.CATEGORIES + "/" + category._id, category);

// delete toy
export const deleteCategory = category =>
  del(url.CATEGORIES + "/" + category);