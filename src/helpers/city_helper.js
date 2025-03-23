import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getCities = () => get(url.CITIES);

// add toy
export const addNewCity = city => post(url.CITIES, city);

// update toy
export const updateCity = city => put(url.CITIES + "/" + city._id, city);

// delete toy
export const deleteCity = city =>
  del(url.CITIES + "/" + city);